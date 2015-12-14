Feature: User can view event details

As a Guest
  I want to view event details
  So that I can apply it

As a User
  I want to view event details
  So that I can apply it or book ticket of that event

  Background:
    Given an event

  Scenario: Guest can view event details
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    Then I should see the event details
    And I should see Buy Tickets button

  Scenario: Guest can not bookmark event
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    Then I should not see bookmark link

  Scenario: Guest can view event's album
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    Then I should see event's album

  @javascript
  Scenario: Guest can view event's party people
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    And I wait 3 seconds
    And I should see event creator name and profile image
    And I should see photographers name and profile image

  @javascript
  Scenario: Guest can view map of the event venue
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    And I wait 3 seconds
    Then I should see a map of venue address

  @javascript
  Scenario: Guest can apply event
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    And I should see appy button

    When I click apply button
    And I wait 3 seconds
    Then I should see a apply form popup

    When I enter valid values for required fields
    And I press "Apply Now"
    And I wait 3 seconds
    Then the form should disappear

  @javascript
  Scenario: Apply form should display error message with invalid input
    Given I am on the homepage
    And I am not logged in
    When I go to event show page
    And I click apply button
    And I wait 3 seconds
    And I enter valid values for required fields
    And I set name fields blank
    And I press "Apply Now"
    And I wait 3 seconds
    Then the error dialog should appear

    When I close the error dialog
    And I set value for name field
    And I set number of guests field blank
    And I press "Apply Now"
    And I wait 3 seconds
    Then the error dialog should appear

    When I close the error dialog
    And I set 1 for number of guests field
    And I set email field blank
    And I press "Apply Now"
    And I wait 3 seconds
    Then the error dialog should appear

    When I close the error dialog
    And I set "no valid@yahoo.com" for email field
    And I press "Apply Now"
    And I wait 3 seconds
    Then the error dialog should appear

  @javascript
  Scenario: user don't have to input name and email to apply
    Given I am on the homepage
    And I am logged in
    When I go to event show page
    And I click apply button
    And I wait 3 seconds
    And I set 1 for number of guests field
    And I press "Apply Now"
    And I wait 3 seconds
    Then the form should disappear

  @javascript
  Scenario: visitor can bookmark/unbookmark event
    Given I am on the homepage
    And I am logged in
    When I go to event show page
    Then I should see bookmark link

    When I click bookmark link
    And I wait 3 seconds
    Then I should see the link changes to bookmarked

    When I click bookmarked link
    And I wait 3 seconds
    Then I should see the link changes to unbookmarked

