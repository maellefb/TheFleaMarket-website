
const id = null;

document.getElementById('usernameForm').addEventListener('submit',function(event)
{
    event.preventDefault();
    submitUser();
})


function logOut()
        {
            alert('logging out of session...');
            localStorage.setItem('log',false)
            
            fetch('/logout', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.sum === true)
                {
                    window.location.href ="Login";
                }
            
            });
       }
 
        

function submitLogin()
{

    const NameUser = document.getElementById('userL').value;
    const secret = document.getElementById('passL').value;
    
    localStorage.setItem('user',NameUser);
    
    fetch('/Logined',
    {
        method: 'POSt',
        headers : 
        {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userL : NameUser, passL: secret}),
    })
    .then(response => response.json())
    .then(data => 
    {
        if (data.login === true)
        {
            localStorage.setItem('log',true);
            alert('Login successful...');
            window.location.href = "GiveAway";
        }
        else
        {
            alert('Login failed');
        }
    })
    .catch(error => {
        console.error('Fetch error: ', error);
        alert(error);
        alert('Network or server occupied');

    });
}

function submitUser()
{
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
   const isValid = checkUser(user,pass);

    if (isValid )
    {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user, password: pass }),
        })
        .then(response => response.json())
        .then(data =>
        {   alert(data.message);
             window.location.reload();
        })
        .catch(error => {
                console.error('Fetch error: ', error);
                alert('Network or server occupied');
        
        });
   
    }
    else 
    {
        alert('false');
        
    }
}



function checkUser(Cuser, pass)
{
    
    if (pass.length < 4)
    {
        alert('Your password is under 4 char please try again');
        return false;
       
    }
    
    if (/^[a-zA-Z0-9]+$/.test(Cuser) === false)
    {
        alert ('Your username contains a special char it is not allowed to');
        return false;
    }

    if (/[A-Z]/.test(pass) === false)
    {
        alert ('Your password is missing an upper-case letter')
        return false;
    }


    if (/\d/.test(pass) === false)
    {
        alert ('Your password is missing a digit')
        return false;
    }

return true;
    
}




  function formValidation() {
    
    let validCat = true;
    const formData = new FormData(document.getElementById("forms"));
    
    const CoDselected = formData.getAll('CoD').length;
    if (!CoDselected) {
        document.getElementById("forgotCoD").innerHTML = "Please pick if your animal is a cat or a dog";
       
        
    }

    const typeSelected = formData.getAll('type').length;
    if (!typeSelected) {
        document.getElementById("forgotType").innerHTML = "Please pick a type";
        validCat = false;
    }

    
    const genderSelected = formData.getAll('gender').length;
    if (!genderSelected) {
        document.getElementById("forgotGender").innerHTML = "Please pick a gender";
        validCat = false;
    }


    return formData; // Return the validity of the form
}

function findPet(formData)
{
    const catorDog = formData.get('CoD');
    
    const type = formData.get('type');
    
    const age = formData.get('age');
   
    const gender = formData.get('gender');
   
    const along = [];
    
    formData.getAll('friendly').forEach(value => {
        along.push(value);
    });
    const allAlong = along.join(' , ');
   alert('searching for a pet...');
    fetch('/WantedPet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CoD: catorDog, type :type, age: age, gender: gender, getAlong: allAlong  }),
        })
        .then(response => response.json())
        .then(data =>
        {   
                document.getElementById("content").innerHTML = data.pets
        })
        .catch(error => {
                console.error('Fetch error: ', error);
                alert('Network or server occupied');
        
        });


}

function Display(str)
{
    document.getElementById('petsDisplay').innerHTML = str;
}

function formValidations() {
    let valid = true;
    const formData = new FormData(document.getElementById("formsg"));


    const CoDselected = formData.getAll('CoD').length;
    if (!CoDselected) {
        document.getElementById("forgotCoD").innerHTML = "Please pick if your animal is a cat or a dog";
       
        return false;
    }

    const typeSelected = formData.getAll('type').length;
    if (!typeSelected) {
        document.getElementById("forgotTypeg1").innerHTML = "Please pick a type";
       
      
    }

    const genderSelected = formData.getAll('gender').length;
    if (!genderSelected) {
        document.getElementById("forgotGenderg").innerHTML = "Please pick a gender";
       
        
    }

    let ptxt = document.getElementById("petInfo");

    if (ptxt.value.trim()==="")
    {
        document.getElementById("forgotInfo").innerHTML = "Please tells us about your pet";
       
      
    }



    let ftxt = document.getElementById("fname");

    if (ftxt.value.trim()==="")
    {
        document.getElementById("forgotfName").innerHTML = "Please enter your first name";
       
        
    }


    let ltxt = document.getElementById("lname");

    if (ltxt.value.trim()==="")
    {
        document.getElementById("forgotlName").innerHTML = "Please enter your last name";
       
    }
    
    let etxt = document.getElementById("email");

    if (etxt.value.trim()==="")
    {
        document.getElementById("forgotEmail").innerHTML = "Please enter your email";
       
       
    }

    return formData; 
}


function formSubmition(formData)
{
    
    const user = localStorage.getItem('user');

    const catorDog = formData.get('CoD');
    
    const type = formData.get('type');
    
    const age = formData.get('age');
   
    const gender = formData.get('gender');
   
    const along = [];
    formData.getAll('along').forEach(value => {
        along.push(value);
    });
    const allAlong = along.join(' , ');
   
    const Info = document.getElementById('petInfo').value;
    const LName = document.getElementById('lname').value;
    const FName = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    
    fetch('/petInf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user, CoD: catorDog, type :type, age: age, gender: gender, getAlong: allAlong, info:Info, lname:LName, fname: FName, email:email }),
        })
        .then(response => response.json())
        .then(data =>
        {   alert(data.letter);
             window.location.reload();
        })
        .catch(error => {
                console.error('Fetch error: ', error);
                alert('Network or server occupied');
        
        });

}






