@wiki-agent
Feature: Wiki agent source and publication helpers
  Scenario: Recognize the same video across URL formats
    Given an isolated wiki with an existing video source
    Then alternate video URLs identify the existing source without modifying it

  Scenario: A missing transcript remains pending
    Given an isolated wiki with an existing video source
    Then a source without evidence is pending and an empty transcript is not evidence

  Scenario: Available evidence still requires inspection
    Given an isolated wiki with an existing video source
    Then supplied evidence is available without claiming it has been verified

  Scenario: Keep meaningful article URL parameters
    Given an isolated wiki with an existing video source
    Then tracking parameters are ignored but distinct article identifiers are preserved

  Scenario: Reject references to missing knowledge
    Given an isolated wiki with an existing video source
    Then a note referencing a missing source fails compilation

  @wiki-agent
  Scenario: Enrich author profiles and validate portrait paths
    Given an isolated wiki with an existing video source
    Then profiles enrich sources and reject unsafe portrait paths

  Scenario: Recognize the same social post across X and Twitter URLs
    Given an isolated wiki with an existing video source
    Then alternate social URLs identify the existing post without merging different posts

  Scenario: Recognize repository roots without merging individual resources
    Given an isolated wiki with an existing video source
    Then alternate repository URLs identify the existing repository without modifying it
    And repository deep links and unrelated GitHub routes remain distinct sources
    And repository sources compile into the collection
