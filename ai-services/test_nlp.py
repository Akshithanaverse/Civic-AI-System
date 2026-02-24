#!/usr/bin/env python3
"""
Comprehensive NLP Testing Suite for Civic AI System
Tests all text analysis functionality including classification, summarization, and urgency detection.
"""

import requests
import json
import time

# Base URL for the Flask AI service
AI_SERVICE_URL = "http://localhost:8000"

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_result(test_name, success, message):
    """Print test result with color coding."""
    status = f"{GREEN}✓ PASS{RESET}" if success else f"{RED}✗ FAIL{RESET}"
    print(f"{status} | {test_name}: {message}")

def test_classify_text():
    """Test text classification endpoint."""
    print(f"\n{BLUE}=== Testing Text Classification ==={RESET}")
    
    test_cases = [
        {
            "text": "There is a large pothole on the main road that's dangerous for vehicles",
            "expected_category": "Pothole"
        },
        {
            "text": "Garbage and waste are piled up on the street corner, it's a health hazard",
            "expected_category": "Garbage"
        },
        {
            "text": "The streetlight on 5th avenue is broken and not working",
            "expected_category": "Streetlight"
        },
        {
            "text": "Water is leaking from the main pipeline causing flooding in the area",
            "expected_category": "Water Leakage"
        },
        {
            "text": "Traffic congestion on the highway during peak hours",
            "expected_category": "Traffic Congestion"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(
                f"{AI_SERVICE_URL}/classify-text",
                json={"text": test_case["text"]}
            )
            
            if response.status_code == 200:
                result = response.json()
                category = result.get("category", "Unknown")
                confidence = result.get("confidence", 0)
                success = category == test_case["expected_category"]
                print_result(
                    f"Classification Test {i}",
                    success,
                    f"Category: {category}, Confidence: {confidence:.2%}"
                )
            else:
                print_result(f"Classification Test {i}", False, f"HTTP {response.status_code}")
        except Exception as e:
            print_result(f"Classification Test {i}", False, str(e))
        
        time.sleep(0.5)  # Rate limiting

def test_summarize_text():
    """Test text summarization endpoint."""
    print(f"\n{BLUE}=== Testing Text Summarization ==={RESET}")
    
    test_cases = [
        "The sidewalk on Main Street has multiple broken tiles and cracks making it unsafe for pedestrians. Old people and children are at risk of tripping and falling. This issue has been ongoing for several months and needs immediate repair.",
        "There is a cluster of garbage bags piled up on the corner of Park Avenue and 5th Street. The trash includes plastic bottles, food waste, and other debris. Local residents have complained about the foul smell and pest infestation.",
        "The streetlamp at the intersection is flickering on and off, and during certain hours it remains completely dark. This creates a safety concern for people walking at night."
    ]
    
    for i, text in enumerate(test_cases, 1):
        try:
            response = requests.post(
                f"{AI_SERVICE_URL}/summarize-text",
                json={"text": text, "max_length": 50, "min_length": 20}
            )
            
            if response.status_code == 200:
                result = response.json()
                summary = result.get("summary", "")
                original_len = result.get("original_length", 0)
                summary_len = result.get("summary_length", 0)
                reduction = (1 - summary_len / original_len) * 100 if original_len > 0 else 0
                
                print_result(
                    f"Summarization Test {i}",
                    True,
                    f"Reduced {reduction:.1f}% | Original: {original_len}ch → Summary: {summary_len}ch\n    Summary: '{summary[:60]}...'"
                )
            else:
                print_result(f"Summarization Test {i}", False, f"HTTP {response.status_code}")
        except Exception as e:
            print_result(f"Summarization Test {i}", False, str(e))
        
        time.sleep(0.5)

def test_detect_urgency():
    """Test urgency detection endpoint."""
    print(f"\n{BLUE}=== Testing Urgency Detection ==={RESET}")
    
    test_cases = [
        {
            "text": "There is an exposed high-voltage wire sparking near the playground causing fire hazard",
            "expected_urgency": 5
        },
        {
            "text": "Water is leaking continuously from the main pipeline, causing flooding in homes",
            "expected_urgency": 4
        },
        {
            "text": "The road has several cracks and potholes that need repair",
            "expected_urgency": 3
        },
        {
            "text": "The area is dirty with dust and minor debris",
            "expected_urgency": 2
        },
        {
            "text": "I want to report an issue in the city",
            "expected_urgency": 1
        }
    ]
    
    urgency_labels = {1: "Very Low", 2: "Low", 3: "Medium", 4: "High", 5: "Critical"}
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(
                f"{AI_SERVICE_URL}/detect-urgency",
                json={"text": test_case["text"]}
            )
            
            if response.status_code == 200:
                result = response.json()
                urgency_level = result.get("urgency_level", 1)
                urgency_label = result.get("urgency_label", "Unknown")
                keywords = result.get("keywords_found", [])
                
                success = urgency_level == test_case["expected_urgency"]
                print_result(
                    f"Urgency Test {i}",
                    success,
                    f"Level: {urgency_level}/5 ({urgency_label}) | Keywords: {keywords}"
                )
            else:
                print_result(f"Urgency Test {i}", False, f"HTTP {response.status_code}")
        except Exception as e:
            print_result(f"Urgency Test {i}", False, str(e))
        
        time.sleep(0.5)

def test_comprehensive_analysis():
    """Test comprehensive text analysis endpoint."""
    print(f"\n{BLUE}=== Testing Comprehensive Text Analysis ==={RESET}")
    
    test_texts = [
        "A large pothole on Main Street is causing damage to vehicles and poses a safety risk",
        "Piles of garbage and waste are accumulating at the corner, creating a health hazard"
    ]
    
    for i, text in enumerate(test_texts, 1):
        try:
            response = requests.post(
                f"{AI_SERVICE_URL}/analyze-text",
                json={"text": text}
            )
            
            if response.status_code == 200:
                result = response.json()
                classification = result.get("classification", {})
                summary = result.get("summary", "")
                urgency = result.get("urgency", {})
                
                print(f"\n  {YELLOW}Analysis Test {i}:{RESET}")
                print(f"    Category: {classification.get('category')} (Confidence: {classification.get('confidence'):.2%})")
                print(f"    Summary: {summary}")
                print(f"    Urgency: Level {urgency.get('level')}/5 ({urgency.get('label')})")
                print(f"    Keywords: {urgency.get('keywords', [])}")
                print_result(f"Comprehensive Analysis {i}", True, "All fields present")
            else:
                print_result(f"Comprehensive Analysis {i}", False, f"HTTP {response.status_code}")
        except Exception as e:
            print_result(f"Comprehensive Analysis {i}", False, str(e))
        
        time.sleep(0.5)

def test_health_check():
    """Test health check endpoint."""
    print(f"\n{BLUE}=== Testing Health Check ==={RESET}")
    
    try:
        response = requests.get(f"{AI_SERVICE_URL}/health")
        if response.status_code == 200:
            result = response.json()
            print_result("Health Check", True, result.get("status", "Running"))
        else:
            print_result("Health Check", False, f"HTTP {response.status_code}")
    except Exception as e:
        print_result("Health Check", False, str(e))

def run_all_tests():
    """Run all NLP tests."""
    print(f"\n{YELLOW}{'='*60}")
    print("CIVIC AI SYSTEM - NLP MODULE TEST SUITE")
    print(f"{'='*60}{RESET}\n")
    
    print(f"Testing NLP Service at: {AI_SERVICE_URL}")
    print(f"Start Time: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    try:
        # Run all tests
        test_health_check()
        test_classify_text()
        test_summarize_text()
        test_detect_urgency()
        test_comprehensive_analysis()
        
        print(f"\n{YELLOW}{'='*60}")
        print("TEST SUITE COMPLETED")
        print(f"{'='*60}{RESET}\n")
        
    except KeyboardInterrupt:
        print(f"\n{RED}Tests interrupted by user{RESET}")
    except Exception as e:
        print(f"\n{RED}Unexpected error: {e}{RESET}")

if __name__ == "__main__":
    run_all_tests()
