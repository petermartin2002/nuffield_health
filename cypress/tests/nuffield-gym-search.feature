Feature: Nuffield health gym location search

    ## Geo location means using multiple background steps isn't possible
    ## Leaving in to highlight that I did use / can use background
    # Background: Navigate to Nuffield Health home page
    #     Given I open the Nuffield Health home page

    Scenario Outline: I can search for Gyms close to "<location>"
        Given I open the Nuffield Health home page
        When I perform a search for gyms in "<postcode>"
        And I confirm the location "<location>" exists
        Then I verify the results returned contain the following gyms "<gyms>"
        Examples:
            | postcode | location      | gyms                                    |
            | BT66     | Craigavon, UK | Glasgow Giffnock, East Kilbride         |
            | L12      | Liverpool, UK | Liverpool, Chester                      |
            | NW5      | London, UK    | Islington, Bloomsbury                   |
            | SA1      | Swansea, UK   | Bridgend, Cwmbran                       |
            | EH1      | Edinburgh, UK | Edinburgh Omni, Edinburgh Fountain Park |

    Scenario Outline: I can search for gyms using my location when set to postcode "<postcode>"
        Given I open the Nuffield Health home page using geolocation: "<postcode>"
        When I perform a search for gyms using "My Location"
        Then I verify the results returned contain the following gyms "<gyms>"
        Examples:
            | postcode | gyms                                    |
            | BT66     | Glasgow Giffnock, East Kilbride         |
            | L12      | Liverpool, Chester                      |
            | NW5      | Islington, Bloomsbury                   |
            | SA1      | Bridgend, Cwmbran                       |
            | EH1      | Edinburgh Omni, Edinburgh Fountain Park |