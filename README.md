# Steps to set up project: 
 NuffieldHealth search for properties 
 This is a cypress test application
- Clone project from
```
-git clone 
```
-Open project in visualcode

-open terminal and navigate to the cloned repo location

# Install node and cypress with following command at the location

# install the node_modules
```
npm install
```
# install latest version of cypress (if required)
```
npm install cypress --save-dev
```

# Now to run the scripts
run the following commands in the terminal

This command will open the cypress runner with .feature file 
```
npm run openCypress
```
cypress runner window open with feature file click on feature file will run the scripts

This command will run the cypress in the terminal headlessly and generate a mochawesome report 
```
npm run runCypress
```
The report is located here:
```
mochawesome-report > test-report.html
```