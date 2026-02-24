#!/usr/bin/env python3
"""
Quick test for urgency detection improvements
"""
import sys
sys.path.insert(0, 'nlp_module')

from nlp import detect_urgency, analyze_text_comprehensive

# Test cases for urgency detection
test_cases = [
    "the road side is full of garbage waste",
    "Water is leaking from pipes causing flooding in homes",
    "Electrical wires sparking near school - EMERGENCY",
    "Pothole on Main Street causing accidents",
    "Street light broken near park",
    "Traffic congestion on main road",
    "Drain is clogged and overflowing",
    "Broken pole fallen across road",
    "Large garbage dump next to school"
]

print("=" * 70)
print("URGENCY DETECTION TEST")
print("=" * 70)

for i, text in enumerate(test_cases, 1):
    level, label, keywords = detect_urgency(text)
    result = analyze_text_comprehensive(text)
    
    print(f"\n{i}. Text: '{text}'")
    print(f"   Urgency Level: {level} ({label})")
    print(f"   Keywords Found: {keywords}")
    print(f"   Classification: {result['classification']['category']} "
          f"({result['classification']['confidence']:.1f}%)")
    print(f"   Summary: {result['summary']}")

print("\n" + "=" * 70)
print("✓ Test Complete")
print("=" * 70)
