import os
import json
from datetime import datetime
from typing import List, Dict

from google.generativeai import GenerativeModel

from ..schemas.multilingual_advisory import AdvisoryInput, AdvisoryMessage, MessageType

class MultilingualAdvisoryService:
    """Generate multilingual advisory messages from a single structured input.

    The service:
    1. Builds language‑agnostic message templates for each MessageType.
    2. Calls Gemini (model defined by GEMINI_MODEL env var) to translate each template
       into the target languages (en, hi, te, or, gu).
    3. Performs a lightweight consistency check – ensures that core factual tokens
       (hazard, location, severity, recommended_action, destination, route) appear
       unchanged in the translated text.
    4. Returns a list of AdvisoryMessage objects ready for API exposure.
    """

    SUPPORTED_LANGUAGES = {
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "or": "Odia",
        "gu": "Gujarati",
    }

    TEMPLATE_MAP: Dict[MessageType, str] = {
        "authority_briefing": (
            "Authority Briefing\n"
            "Hazard: {hazard}\n"
            "Location: {location}\n"
            "Severity: {severity}\n"
            "Time: {time}\n"
            "Recommended Action: {recommended_action}\n"
            "Destination: {destination}\n"
            "Route: {route}\n"
            "Source: {official_source}\n"
        ),
        "general_public_warning": (
            "PUBLIC WARNING\n"
            "A {severity} {hazard} is expected at {location} on {time}. "
            "Please follow the recommended action: {recommended_action}."
        ),
        "simple_language_warning": (
            "⚠️ {hazard} alert!\n"
            "Where: {location}\n"
            "When: {time}\n"
            "What to do: {recommended_action}."
        ),
        "personalized_advisory": (
            "Dear Resident,\n"
            "A {severity} {hazard} may affect your area ({location}) at {time}. "
            "We advise you to {recommended_action}. "
            "Proceed to {destination} via route {route}."
        ),
    }

    def __init__(self) -> None:
        # Initialise Gemini model – use environment variables for security
        api_key = os.getenv("GEMINI_API_KEY")
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in environment")
        # The library picks up the key from env; we just set the model
        self.model = GenerativeModel(model_name)

    def _fill_template(self, msg_type: MessageType, data: AdvisoryInput) -> str:
        template = self.TEMPLATE_MAP[msg_type]
        # Use dict conversion; datetime isoformat for readability
        payload = data.dict()
        payload["time"] = data.time.isoformat()
        # Ensure optional fields are rendered as strings (or "N/A")
        payload.setdefault("destination", "N/A")
        payload.setdefault("route", "N/A")
        return template.format(**payload)

    def _translate(self, text: str, target_lang: str) -> str:
        # Gemini prompt – ask only for translation, no hallucination.
        prompt = (
            f"Translate the following advisory into {self.SUPPORTED_LANGUAGES[target_lang]} "
            f"without changing any factual tokens (hazard, location, severity, time, "
            f"recommended_action, destination, route, source). Keep the same line breaks.\n"
            f"---\n{text}\n---"
        )
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def _check_consistency(self, original: str, translated: str) -> bool:
        # Very simple token check – verify each token appears unchanged in the translation.
        tokens = ["hazard", "location", "severity", "time", "recommended_action", "destination", "route"]
        for token in tokens:
            if token in original:
                value = original.split(token + ":")[-1].split("\n")[0].strip()
                if value and value not in translated:
                    return False
        return True

    def generate(self, input_data: AdvisoryInput) -> List[AdvisoryMessage]:
        messages: List[AdvisoryMessage] = []
        for msg_type in self.TEMPLATE_MAP.keys():
            base_text = self._fill_template(msg_type, input_data)
            for lang_code in self.SUPPORTED_LANGUAGES.keys():
                translated = self._translate(base_text, lang_code) if lang_code != "en" else base_text
                consistency = self._check_consistency(base_text, translated)
                messages.append(
                    AdvisoryMessage(
                        language=lang_code,
                        message_type=msg_type,
                        content=translated,
                        timestamp=datetime.utcnow(),
                        source=input_data.official_source,
                        consistency_ok=consistency,
                    )
                )
        return messages
