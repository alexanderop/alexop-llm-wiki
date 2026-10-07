Feature: Read diagrams in the wiki style
  Scenario: Mermaid diagrams follow both themes and remain readable on mobile and offline
    Given I open my template wiki
    Then authored diagrams use the wiki theme and work offline
