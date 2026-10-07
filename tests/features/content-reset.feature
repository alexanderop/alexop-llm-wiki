@content-reset
Feature: Empty starter content safely
  Scenario: Preview and reset content explicitly
    Given an isolated starter with notes and raw sources
    Then resetting without confirmation preserves all files
    And resetting content preserves raw sources

  Scenario: Refuse linked content directories
    Given an isolated starter with notes and raw sources
    Then reset refuses a symbolic link before deleting any content
