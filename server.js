import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
app.set('view engine','ejs');


app.use(cookieParser());
app.use(session(
    {
        secret:'coco',
        resave:false,
        saveUninitialized: true,
        cookie:{secure:false,httpOnly:false}

    }
));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000``;

app.use(express.json());
app.use(express.static('public'));

app.set('views', './views');


app.set('views',path.join(__dirname,'views'));

app.get('/', (req, res) =>
{
    res.render('Home');
});

app.get('/BrouwseAvailablePets',(req,res) =>
{
    res.render('BrouwseAvailablePets');
});


app.get('/home',(req,res) =>
{
    res.render('Home')
});

app.get('/CatCare',(req,res) =>
{
    res.render('CatCare');
});

app.get('/ContactUS',(req,res) =>
{
    res.render('ContactUS');
});

app.get('/CreateAccount',(req,res) =>
{
    res.render('CreateAccount');
});

app.get('/DogCare',(req,res) =>
{
    res.render('DogCare');
});

app.get('/FindAPet', (req,res) =>
{
    res.render('FindAPet');
});

app.get('/GiveAway',(req,res) =>
{
    res.render('GiveAway');
});

app.get('/Login',(req,res) =>
{
    res.render('Login');
});

app.get('/TermsAndConditions',(req,res) =>
{
    res.render('ContactUS');
});


app.post('/WantedPet',async(req, res)=>
{
    const {CoD, type, age, gender, getAlong} = req.body;
    
    try 
    {
       let check = await  petCheck(CoD, type, age, gender, getAlong);
        if (check === false)
        {
            res.json({pets: "No pets with simialr attributes where found"});
            console.log('here');
            return;
            
        }
        else 
        {
            res.json({pets :check});
            return;
        }
        
    }
    catch (error)
    {   console.error(error);
        
        if (!res.headersSent)
        {
        res.status(500).send('Internal Server Error');  
        }
        
    }



});



async function petCheck(CoD,type, age, gender, getAlong)
{
    const filePath = path.join(__dirname,'public', 'PetInfo.txt');
    const data = fs.readFileSync(filePath, 'utf-8');
        const pets = data.split('\n');
        
        let available = " <br> ";
        let noPets = true;

        for (let pet of pets)
        {
            const[num,user,StoredCoD,StoredType, StoredAge, StoredGender, StoredAlong,info,name,lname,email] = pet.split(':');
            
            if (StoredCoD === CoD)
            {
                if (StoredType === type || StoredAge === age || StoredGender === gender || StoredAlong === getAlong)
                {
                    let Str = `<br>This ${StoredCoD} is under our files as pet # ${num} <br> 
                    Type: ${StoredType} <br>
                    Gender: ${StoredGender} <br>
                    Get Along with: ${StoredAlong} <br>
                    Some Extra Info: ${info}<br>`;
                
                    available += Str;
                    noPets = false;
                }
            }

        }
        if (noPets === true)
        {
            return false;
        }
        return available;
    }

app.post('/petInf', async (req,res) =>{
    const {username, CoD, type, age, gender, getAlong, info, lname, fname, email} = req.body;

    try
    {
        let petCount = parseInt(req.cookies.petCount || 0) +1;
        res.cookie('petCount',petCount, {maxAge: 86400000 * 7, httpOnly: true });

        petWriting(petCount, username, CoD, type, age, gender, getAlong, info, lname, fname, email);
        res.json({letter: 'pet written to file'});
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({letter: 'an error occurs'})
    }

});

function petWriting(petCount,un, Cod,type, age, gender, gA, info, lname, fname, email)
{
    const filePath = path.join(__dirname, 'public','PetInfo.txt');
    const newPet = `${petCount}:${un}:${Cod}:${type}:${age}:${gender}:${gA}:${info}:${lname}:${fname}:${email}\n`;
    fs.appendFileSync(filePath, newPet, 'utf-8');
}



app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        let both = false;
        let userExsits = await existsCheck(username, password, both);
        if (userExsits === false) {
            writeUser(username, password);
            res.json({success:true, message: 'User registered successfully.' });
        } else {
            res.json({success: false, message: ' User already exsists'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred'});
    }
});


app.post('/logout', (req, res) => {
    
    if (req.session)
    {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.json({sum:true});
        });
    }
});


app.post('/check-session', (req, res) => {
    if (req.session.username !=null) {
        res.json({ loggedIn: true,});
    } else {
        res.json({ loggedIn: false });
    }
}); 


app.post('/Logined', async(req, res) => {
    const {userL, passL} = req.body;
    try 
    {
        let UserHere = await existsCheck(userL, passL, true);
        
        if (UserHere === true)
        {
            req.session.username =userL;
            res.json({login: true});
        }
        else
        {
            res.json({login: false});
        }
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ login: false, message: 'An error occurred'});
    
    }
});


async function existsCheck(username, password, both) {
    const filePath = path.join(__dirname,'public', 'logins.txt');
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const users = data.split('\n');

        for (let user of users) {
            const [storedUsername, storedPassword] = user.split(':');
            if (storedUsername === username && both === false) {
                return true; // User exists
            }
            if (storedUsername === username && storedPassword === password && both === true)
            {
                return true;
            }
        }
        return false; // User does not exist
    } catch (err) {
        console.error('Error reading file:', err);
        throw err; // Rethrow to be handled in calling function
    }
}

function writeUser(username, password) {
    const filePath = path.join(__dirname, 'public','logins.txt');
    const newUser = `${username}:${password}\n`;
    fs.appendFileSync(filePath, newUser, 'utf-8');

}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
