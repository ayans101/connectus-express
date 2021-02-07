const express = require('express');
const app = express();
const port = 8080;
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);

//  use express router
app.use('/', require('./routes/index'));

//  set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
        return;
    }
    console.log(`Server is running on port : ${port}`);
});