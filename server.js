const express = require('express') // Import de Express
const userRoutes = require('./routes/user.routes');
const lotRoutes = require('./routes/lot.routes');
const postRoutes = require('./routes/post.routes')
const auctionRoutes = require('./routes/auction.routes');
const utilsRoutes = require('./routes/utils.routes');
const bidRoutes = require('./routes/bid.routes');
const verificationRoutes = require('./routes/verification.routes');
const proposalRoutes = require('./routes/proposal.routes');
const saleRoutes = require('./routes/sale.routes');
const passwordRoutes = require('./routes/password.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
if (!process.env.NODE_ENV) require('dotenv').config({ path: './config/dev.env' });  //Défintion du path de var d'env
const { requireAuth, checkUserForBilling, checkUserForProposal } = require('./middleware/auth.middleware');
const cors = require('cors');
const { connectDBWithRetry } = require('./config/db');

const app = express(); // Définit l'app comme le framework Express

const corsOptions = {
    origin: true,
    origin: process.env.CLIENT_URL, // Disable if deployed on different server
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposeHeaders': ['sessionId'],
    'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE',
    'preflightContinue': false
}

app.use(cors(corsOptions)); // Protection par CORS : seul les requêtes venant du site sont autorisées.

app.use(bodyParser.json()); //décodage des body json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Pour lire les cookies

app.use(checkUserForBilling, checkUserForProposal, express.static('uploads')) // Expose uploads

if (process.env.NODE_ENV === 'development') app.use(require('./utils/requestAnalyzer').router); // Request analyzer

//jwt
// app.get('*', (req, res, next) => {console.log(res.statusCode); next()});
app.get('/api/jwtid', requireAuth, (req, res) => res.status(200).send(res.locals.userId)); 

// routes
app.use('/api/user', userRoutes);
app.use('/api/lot', lotRoutes);
app.use('/api/post', postRoutes);
app.use('/api/auction', auctionRoutes);
app.use('/api/utils', utilsRoutes);
app.use('/api/bid', bidRoutes);
app.use('/api/verif', verificationRoutes);
app.use('/api/proposal', proposalRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/password', passwordRoutes);

// Lancement du server (toujours en dernier)
app.listen(process.env.PORT, async () => {
    console.log('\u001b[32;1m');
    console.log(`Listening on port ${process.env.PORT}`);
    console.log("Environement :", process.env.NODE_ENV);
    await connectDBWithRetry(process.env.MONGO_DB_ADRESS);

    if (process.env.NODE_ENV === 'development'){
        console.log('\u001b[36;1m');
        console.log("Request analysis :\n\u001b[0m")
    }
})