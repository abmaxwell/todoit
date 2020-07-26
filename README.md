<h1 align="center">
  <a href="https://todoit-main.herokuapp.com">
    <img
      src="./assets/img/branding/toDoListLogo_V1WebOptimized.png"
      alt="ToDoIt™ Logo"
      width="600"
    />
  </a>
</h1>
<br />
<div align="center">
  <img src="./assets/img/readme/techstack/html5.svg" width="40px" />
  <img src="./assets/img/readme/techstack/css3.svg" width="60px" />
  <img src="./assets/img/readme/techstack/javascript.svg" width="55px" />
  <img src="./assets/img/readme/techstack/node.svg" width="60px" />
  <img src="./assets/img/readme/techstack/express.svg" width="55px" />
  <img src="./assets/img/readme/techstack/ejs.svg" width="55px" />
  <img src="./assets/img/readme/techstack/sass.svg" width="60px" />
  <img src="./assets/img/readme/techstack/bootstrap.svg" width="60px" />
  <img src="./assets/img/readme/techstack/eslint.svg" width="55px" />
  <img src="./assets/img/readme/techstack/prettier.svg" width="55px" />
<div>
<div align="center">
  <img src="./assets/img/readme/techstack/mongodb.svg" width="165px" />
  <img src="./assets/img/readme/techstack/mongoose.svg" width="165px" />
  <img src="./assets/img/readme/techstack/heroku.svg" width="165px" />
</div>
<br />
<h1 align="center">
  <a href="https://todoit-main.herokuapp.com">{ Live Demo }</a>
</h1>
<div align="left">
  <h1>Overview</h1>
  <p>
    <strong>ToDoIt™</strong> is a full-stack application built to mimic
    MacOS's Reminders application with a minimalist feature set. In its
    current state, the app allows users to create/delete a list as well
    ascreate/delete/update list items.
  </p>
  <h1>Breakdown</h1>
      <p>The tech-stack includes:</p>
      <ul>
        <li>
          HTML5 / CSS3 / Javascript (ES6)
          <ul>
            <li>Because this is the foundation of literally every web app.</li>
          </ul>
        </li>
        <li>
          Styled with
          <code>Sass</code>
          <ul>
            <li>
              Greatly simplifies code necessary to customize
              <em>Bootstrap</em> using <em>mixins</em> and <em>variables</em>.
            </li>
            <li>
              All partial <code>Sass</code> files are compiled into a minified
              <code>CSS</code> file.
            </li>
          </ul>
        </li>
        <li>
          RESTful backend via <code>Node.js</code> and <code>Express.js</code>.
          <ul>
            <li>
              Each route has one and only one purpose per the specifications of
              a RESTful service.
            </li>
            <li>
              All data is transmitted via the <code>request.body</code> instead
              of via <code>request.params</code>.
            </li>
          </ul>
        </li>
        <li>
          Server side page rendering via <code>EJS</code> templating engine.
        </li>
        <li>
          General app structure and layout created using
          <code>Bootstrap 4</code>.
        </li>
        <li>NoSQL database handled by <code>MongoDB</code>.</li>
        <li>
          Database models created using <code>Mongoose</code> for simplicity.
        </li>
        <li>
          Deployed via <code>Heroku</code> with continuous integration via
          <code>GitHub</code> integration.
        </li>
        <li>Linted using <code>ESLint</code>.</li>
        <li>Formatted using <code>Prettier</code>.</li>
      </ul>
       <h1>Installation</h1>
      <ol>
        <li>
          <code>$ git clone https://github.com/abmaxwell/todoit.git</code>
        </li>
        <li><code>$ cd todoit-master</code></li>
        <li>
          <code>$ npm install</code>
          <ul>
            <li>Installs all dependencies from <code>package.json</code>.</li>
            <li>
              Creates a folder called <code>node_modules</code> at
              <code>./</code>
            </li>
            <li>
              Install package versions listed in <code>package.json</code>
            </li>
          </ul>
        </li>
        <li><code>$ npm update</code></li>
        <li>
          In order for ToDoIt™ to work correctly this part must be completed:
          <ul>
            <li>
              Create a free MongoDB account
              <a
                href="https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_united_states_search_brand_atlas_desktop&utm_term=mongodbatlas&utm_medium=cpc_paid_search&utm_ad=e&gclid=CjwKCAjwsO_4BRBBEiwAyagRTdMTlcxYM8x1SM3EGR9x9lvFeUI44fTlVQCuvknV60VIZ9yVr3EijRoCrSgQAvD_BwE"
                >here</a
              >.
            </li>
            <li>
              Create a new cluster. Guide to
              <a
                href="https://docs.atlas.mongodb.com/tutorial/create-new-cluster/"
                >creating a cluster.</a
              >
            </li>
            <li>Create a new Database admin called <code>app-admin</code></li>
          </ul>
        </li>
        <li>
          This project makes use of the <code>dotenv</code> npm module to create
          custom <code>enviroment variables</code>. Create a new file at the
          root <code>./</code> called <code>.env</code>, inside that file create
          the following variables:
          <ul>
            <br />
            <li>DB_NAME="DESIRED_NAME_OF_DB"</li>
            <li>DB_KEY="PASSWORD_OF_APP-ADMIN"</li>
            <li>DB_URI="URI_OF_CLUSTER"</li>
            <br />
          </ul>
          Replace all "PLACE_HOLDERS" with appropriate information. If there's
          any confusion look at the URL in <code>db.js</code> and read the
          documentation
          <a href="https://docs.atlas.mongodb.com/driver-connection/">here</a>.
        </li>
        <li>
          <code>$ node run start</code>
          <ul>
            <li>
              The app should open automatically in your browser usually at
              <code>https://localhost:3000/</code>
            </li>
            <li>
              Server and database status will print out in your IDE's console.
            </li>
          </ul>
        </li>
      </ol>
      <h1>Notes</h1>
      <ul>
        <li>
          There are <strong>NO</strong> user accounts. This means any
          <em>list</em> and <em>list item</em> created <u>must</u> be considered
          <strong>PUBLIC</strong>.
        </li>
        <li>
          Each created <em>list</em> has a <u>unique</u> URL. This allows for
          individual <em>lists</em> with <u>duplicate</u> <em>list names</em> to
          be created.
        </li>
        <li>
          Anyone with a <em>list's unqiue URL</em> or access to
          <code>https://localhost:3000/</code> (or deployed domain) can see,
          create, delete, and update any <em>list</em> or
          <em>list item</em> created by another "<em>user</em>" (hence the
          <strong>PUBLIC</strong> nature of this app).
        </li>
        <li>
          The <code>Profile</code> is a necessary part of deploying
          <code>Node.js</code> apps on <code>Heroku</code>. Learn more about deploying 
          <a href="https://devcenter.heroku.com/articles/deploying-nodejs"
            >here</a
          >.
        </li>
        <li>
          Due to the use of server-side rendering via <code>EJS</code> page
          reloads are necessary when creating/deleting new <em>lists</em> or
          creating/deleting/updating <em>list items</em>.
        </li>
      </ul>
  
  
 
 </div>
