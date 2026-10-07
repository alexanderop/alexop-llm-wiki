Feature: A reusable wiki template
  Scenario: Read and search the current content
    Given I open my template wiki
    Then the library reflects my Markdown files
    And I can find and read an available note

  Scenario: Read the template offline
    Given I open my template wiki
    When I take the template offline
    Then the template and graph work without a network

  Scenario: Keep appearance preferences
    Given I open my template wiki
    When I change the template appearance
    Then the template remembers my choices after reload

  Scenario: Operate search with the keyboard
    Given I open my template wiki
    When I open and close template search with the keyboard
    Then focus returns to the template search button

  Scenario Outline: Use English even with a previously saved German preference
    Given my browser previously preferred German
    And I open my template wiki
    When I view the wiki at <width> pixels wide
    Then the wiki uses English without a language selector

    Examples:
      | width |
      | 1280  |
      | 390   |
