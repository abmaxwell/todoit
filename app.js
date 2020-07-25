// IMPORT REQUIRED MODULES
require('dotenv').config();
require('./db');
const List = require('./models/List');
const _ = require('lodash');
const express = require('express');
const async = require('async');
const mongoose = require('mongoose');
const app = express();

// DEFINE VIEW ENGINE & OPTIONS
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// DEFINE SERVER PORT.
const PORT = process.env.PORT || 3000;

// CONFIRM SERVER IS RUNNING.
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

// DEFINE GLOBAL VARIABLES & USE
let previousColor; /* Used in fn generateColor() */

////////////////////////////////////////////////////////////////////////////////
// GET ROUTES
////////////////////////////////////////////////////////////////////////////////

// HOME ROUTE
app.get('/', function (req, res, next) {
  // Define tasks to complete.
  const tasks = [
    function (cb) {
      // Determine if this is the intial app run.
      List.estimatedDocumentCount({}, function (error, count) {
        if (error) return cb(error);
        cb(null, count);
      });
    },
    function (cb) {
      // Find active list in the DB.
      List.findOne(
        {
          name: 'today',
        },
        function (error, activeList) {
          if (error) return cb(error);
          cb(null, activeList);
        }
      );
    },
    function (cb) {
      // Find all lists in the DB.
      List.find({}, function (error, lists) {
        if (error) return cb(error);
        cb(null, lists);
      });
    },
  ];

  // Start ASYNCE tasks.
  async.series(tasks, function (error, results) {
    if (error) {
      next(error);
    } else {
      // results[count, activeList, lists]
      if (!results[0]) {
        init(function (error) {
          if (error) next(error);
          res.redirect(301, '/');
        });
      } else {
        res.render('main', {
          pageTitle: 'ToDoIt™ - Lists for Daily Life',
          activeList: results[1],
          lists: results[2],
        });
      } // End Inner IF/ELSE
    } // End Outter IF/ELSE
  }); // End ASYNC
}); // End GET HOME

// LISTS ROUTE
app.get('/list/:listID', function (req, res, next) {
  // Requested list _id.
  const listID = _.trim(req.params.listID);
  const tasks = [
    function (cb) {
      // Find requested list in the DB.
      List.findById(listID, function (error, activeList) {
        if (error) return cb(error);
        cb(null, activeList);
      });
    },
    function (cb) {
      // Find all lists in the DB.
      List.find({}, function (error, lists) {
        if (error) return cb(error);
        cb(null, lists);
      });
    },
  ];

  // Start ASYNC tasks.
  async.series(tasks, function (error, results) {
    if (error) {
      res.status(404);
      next(error);
    } else {
      if (results[0] === null) {
        // List Not Found!
        res.status(404);
        next(`List "${listID}" not found!`);
      } else {
        res.render('main', {
          pageTitle: `MyList | ${_.startCase(results[0].name)}`,
          activeList: results[0],
          lists: results[1],
        });
      } // End Inner IF/ELSE
    } // End Outter IF/ELSE
  }); // End ASYNC
}); // End GET LISTS

////////////////////////////////////////////////////////////////////////////////
// POST ROUTES
////////////////////////////////////////////////////////////////////////////////

// CREATE LIST
app.post('/createlist', function (req, res) {
  const listName = _.lowerCase(req.body.listName);
  List.create(
    {
      name: listName,
      color: generateColor(),
      icon: 'list',
      items: [],
    },
    function (error, list) {
      if (error) next(error);
      res.redirect(301, `/list/${list._id}`);
    }
  );
}); // END CREATE LIST

// DELETE LIST
app.post('/deletelist', function (req, res) {
  const listID = req.body.listID;
  List.findByIdAndDelete(listID, function (error, list) {
    if (error) next(error);
    res.redirect(301, '/');
  });
}); // END DELETE LIST

// ADD ITEM TO LIST
app.post('/additem', function (req, res) {
  const listItem = req.body.listItem;
  const listID = req.body.listID;
  List.findByIdAndUpdate(
    listID,
    {
      $push: {
        items: {
          content: listItem,
        },
      },
      $inc: {
        itemsCount: 1,
      },
    },
    function (error, list) {
      if (error) next(error);
      res.redirect(301, `/list/${listID}`);
    }
  ); // End findByIdAndUpdate
}); // End ADD ITEM

// UPDATE ITEM IN LIST
app.post('/updateitem', function (req, res) {
  const listID = req.body.listID;
  const itemID = req.body.itemID;
  const content = req.body.itemContent;
  if (content.length === 0 || isNullOrWhitespace(content)) {
    // Empty text area submitted. Delete item.
    deleteItem(listID, itemID, function (error, results) {
      if (error) next(error);
      res.redirect(301, `/list/${listID}`);
    });
  } else {
    List.findOneAndUpdate(
      {
        'items._id': itemID,
      },
      {
        $set: {
          'items.$.content': content,
        },
      },
      function (error, list) {
        if (error) next(error);
        res.redirect(301, `/list/${listID}`);
      }
    );
  } // End IF/ELSE
}); // End UPDATE ITEM

// DELETE ITEM FROM LIST
app.post('/deleteitem', function (req, res) {
  const listID = req.body.listID;
  const itemID = req.body.itemID;
  deleteItem(listID, itemID, function (error) {
    if (error) next(error);
    res.redirect(301, `/list/${listID}`);
  });
}); // End DELETE ITEM

/*******************************************************************************
| ERROR HANDLERS
*******************************************************************************/

// NON-EXSITING URL HANDLER
app.use(function (req, res, next) {
  res.status(404);
  next('Page Not Found');
});

// MAIN ERROR HANDLER
app.use(function (error, req, res, next) {
  console.log(error);
  // Handle 404 errors
  if (res.statusCode >= 400 && res.statusCode < 500) {
    // Respond with HTML page
    if (req.accepts('html')) {
      const errorContent = generateErrorContent(res.statusCode);
      const imageContent = {
        class: 'error404',
        url: '/img/branding/error400_WebOptimized.png',
        alt: '404 error image',
      };
      res.render('error', {
        pageTitle: `${res.statusCode} - ${error}`,
        pageImage: imageContent,
        statusCode: res.statusCode,
        errorContent: errorContent,
      });
      return;
    }

    // Respond with json
    if (req.accepts('json')) {
      res.json({
        error: `${res.statusCode} - Page Not found`,
      });
      return;
    }

    // Default to plain-text. send()
    res.type('txt').send(`${res.statusCode} - Page Not found`);
  } else {
    // Handle 500 errors
    res.status(500);

    // Respond with HTML page
    if (req.accepts('html')) {
      const errorContent = generateErrorContent(res.statusCode);
      const imageContent = {
        class: 'error500',
        url: '/img/branding/error500_WebOptimized.png',
        alt: '500 error image',
      };
      res.render('error', {
        pageTitle: `${res.statusCode} - Internal Server Error`,
        pageImage: imageContent,
        statusCode: res.statusCode,
        errorContent: errorContent,
      });
      return;
    }

    // Respond with json
    if (req.accepts('json')) {
      res.json({
        error: `${res.statusCode} - Internal Server Error`,
      });
      return;
    }

    // Default to plain-text. send()
    res.type('txt').send(`${res.statusCode} - Internal Server Error`);
  }
});

////////////////////////////////////////////////////////////////////////////////
// APP FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

// INITIALIZER
function init(cb) {
  List.create(
    {
      permanent: true,
      name: 'today',
      color: 'blue-gray',
      icon: 'clock',
      items: [
        {
          content: 'Welcome to ToDoIt™!',
        },
        {
          content: '← Press this to delete an item.',
        },
        {
          content: '↓ Type below to add a new item to the list.',
        },
      ],
    },
    function (error, list) {
      if (error) return cb(error);
    }
  );
  return 'Initalized';
} // End init

// DELETE ITEM
function deleteItem(listID, itemID, cb) {
  // Find active list in the DB.
  List.findByIdAndUpdate(
    listID,
    {
      $pull: {
        items: {
          _id: itemID,
        },
      },
      $inc: {
        itemsCount: -1,
      },
    },
    function (error) {
      if (error) return cb(error);
      return cb(null, 'Success');
    }
  );
} // END deleteItem

// CHECK FOR EMTPY TEXT_FIELD
function isNullOrWhitespace(input) {
  return !input || !input.trim();
}

// GENERATE RANDOM BRAND COLOR
function generateColor() {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue-gray'];
  const randomColor = Math.floor(Math.random() * colors.length);
  if (previousColor !== randomColor) {
    previousColor = randomColor;
    return colors[randomColor];
  } else {
    generateColor();
  }
}

// GENERATE CUSTOM ERROR CONTENT
function generateErrorContent(errorcode) {
  let message;
  switch (errorcode) {
    case 404: {
      const reason = 'Page Not Found';
      const messages404 = [
        {
          reason: reason,
          message:
            "It looks like someone made a mistake. We're not sure who caused it (cough cough) and we don't like to point fingers so... ",
          btn: 'Click here to save face.',
        },
        {
          reason: reason,
          message:
            "It looks like the list you're looking for doesn't exist. That either means you never created it. In which case I'm sure you didn't need to do those things anyway, right? Or you're so awesome that you already completed and deleted the list. In which case, all we have to say is way To-Do-It you go-getter you! ",
          btn: 'Create a new list.',
        },
        {
          reason: reason,
          message:
            "It's okay to break things occasionally. Some even say it's therapeutic and liberating. We just ask you don't make it a regular habit as it tends to make all the little list people sad. You don't want sad list people on your conscious, do you? ",
          btn: 'Click here to unbreak things.',
        },
        {
          reason: reason,
          message:
            'Uh Oh! Someone turned the ToDoIt™ logo into a question mark. Did you do it? If so, no worries it can be fixed by the typography wizard. ',
          btn: 'Summon the typography wizard now!',
        },
      ];
      message = messages404[Math.floor(Math.random() * messages404.length)];
      break;
    }
    case 500: {
      message = {
        reason: 'Internal Server Error',
        message:
          "Well this is awkward! Our lovely ToDoIt™ logo is all broken. Don't worry we're getting someone to fix it ASAP! In the mean time please feel free to check our homepage to see if it's been fixed: ",
        btn: 'Visit homepage.',
      };
      break;
    }
    default: {
      message = 'Unknown error occured';
    }
  }
  return message;
}
