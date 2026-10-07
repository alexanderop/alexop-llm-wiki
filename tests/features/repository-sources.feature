Feature: Rediscover saved repositories
  Scenario: Repositories remain discoverable through filters and search
    Given I open my template wiki
    Then saved repositories can be filtered and found by their source URL
