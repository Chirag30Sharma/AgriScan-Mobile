const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const multer = require('multer');
const app = express()
const axios = require('axios'); // Import the axios library for making HTTP requests
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = file.originalname.split('.').pop();
        const uniqueFilename = `${timestamp}.${extension}`;
        cb(null, uniqueFilename);
    },
});

const upload = multer({ storage });

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
})

app.post('/user/registration', async (req, res) => {
    try {
        // Validate request body against farmer schema
        const { error } = validateFarmer(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Insert new farmer profile into Supabase table
        const { data, error: insertError } = await supabase
            .from('farmerProfile')
            .insert([
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone_number: req.body.phone_number,
                    password: req.body.password
                }
            ]);

        if (insertError) {
            throw insertError;
        }

        // Return success response
        res.status(201).send('Registration successful');
    } catch (error) {
        console.error('Error registering farmer:', error.message);
        res.status(500).send('Internal server error');
    }
});

// Function to validate farmer profile data against schema
function validateFarmer(farmer) {
    // This is just a placeholder function
    return { error: null }; // Return null if validation passes, otherwise return error object
}

app.post('/user/login', async (req, res) => {
    try {
        // Query Supabase to find the user with the provided phone number
        const { data, error } = await supabase
            .from('farmerProfile')
            .select('*')
            .eq('phone_number', req.body.phone_number)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            // If no user found with the provided phone number
            res.status(200).send({ code: 2 });
        } else if (data.password === req.body.password) {
            // If password matches, send user data
            res.status(200).send({ code: 1, phone_number: data.phone_number, first_name: data.first_name, last_name: data.last_name });
        } else {
            // If password does not match
            res.status(200).send({ code: 3 });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send();
    }
});

app.get('/user/chat', async (req, res) => {
    try {
        const { data, error } = await supabase.from('farmerChat').select('*').limit(1000);
        
        if (error) {
            throw error;
        }

        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching chat data:', error.message);
        res.status(500).send();
    }
});

app.post('/user/chat', async (req, res) => {
    try {
        // Insert new chat into Supabase table
        const { data, error: insertError } = await supabase
            .from('farmerChat')
            .insert([
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone_number: req.body.phone_number,
                    photo: req.body.photo,
                    title: req.body.title,
                    description: req.body.description
                }
            ]);

        if (insertError) {
            throw insertError;
        }

        // Respond with success
        res.status(200).send();
    } catch (error) {
        console.error('Error inserting chat:', error.message);
        res.status(500).send();
    }
});

app.post('/user/chat/:chatid/like', async (req, res) => {
    try {
        const chatId = req.params.chatid;

        // Retrieve current liked count from the database
        const { data: chatData, error: fetchError } = await supabase
            .from('farmerChat')
            .select('liked')
            .eq('chat_id', chatId)
            .single();

        if (fetchError) {
            throw fetchError;
        }

        // Increment the liked count and update it in the Supabase table
        const updatedLikedCount = chatData.liked + 1;

        const { error: updateError } = await supabase
            .from('farmerChat')
            .update({ liked: updatedLikedCount })
            .eq('chat_id', chatId);

        if (updateError) {
            throw updateError;
        }

        // Return success response
        res.status(201).send('Liked the chat');
    } catch (error) {
        console.error('Error liking the chat:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.post('/user/chat/:chatid/dislike', async (req, res) => {
    try {
        const chatId = req.params.chatid;

        // Retrieve current dislike count from the database
        const { data: chatData, error: fetchError } = await supabase
            .from('farmerChat')
            .select('dislike')
            .eq('chat_id', chatId)
            .single();

        if (fetchError) {
            throw fetchError;
        }

        // Increment the dislike count and update it in the Supabase table
        const updatedDisLikedCount = chatData.dislike + 1;

        const { error: updateError } = await supabase
            .from('farmerChat')
            .update({ dislike: updatedDisLikedCount })
            .eq('chat_id', chatId);

        if (updateError) {
            throw updateError;
        }

        // Return success response
        res.status(201).send('DisLiked the chat');
    } catch (error) {
        console.error('Error disliking the chat:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.post('/upload/image', async (req, res) => {
  try {
    const { data, error } = await supabase.from('farmerProblem').insert([
      {
        photo: req.body.photo,
        farmer_id: req.body.phone_number,
        farmer_name: req.body.first_name + ' ' + req.body.last_name,
        location: req.body.location,
      }
    ]);

    if (error) {
      console.error(error);
      res.status(500).send();
    } else {
      // Wait for 500ms to ensure data is inserted
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if data was inserted successfully
      const { count } = await supabase
        .from('farmerProblem')
        .select('*', { count: 'exact', head: true })
        .eq('farmer_id', req.body.phone_number);

      if (count === 0) {
        console.error('No data found for the given farmer_id');
        res.status(500).send();
      } else {
        // Get the problem_id of the newly inserted row
        const { data: problemData, error: problemError } = await supabase
          .from('farmerProblem')
          .select('problem_id')
          .eq('farmer_id', req.body.phone_number)
          .order('created_at', { ascending: false })
          .limit(1);

        if (problemError) {
          console.error(problemError);
          res.status(500).send();
        } else {
          const problemId = problemData[0].problem_id;
        //   console.log('New problem ID:', problemId);

          // Send the problem_id to the prediction endpoint
          try {
            const response = await axios.post(`http://127.0.0.1:5000/predict/${problemId}`);
            // Handle the prediction response as needed
            res.status(200).send();
          } catch (predictionError) {
            console.error('Error sending prediction request:', predictionError);
            res.status(500).send();
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

app.post('/history', async (req, res) => {
    try {
      const { phone_number } = req.body;
  
      // Fetch data from farmerResponse table
      const { data: responseData, error: responseError } = await supabase
        .from('farmerResponse')
        .select('problem_id, predicted_label, prescription, diagnosis, steps_to_be_taken')
        .eq('farmer_id', phone_number);
  
      if (responseError) {
        console.error('Error fetching data from farmerResponse table:', responseError);
        return res.status(500).send({ error: 'Failed to fetch data from the database' });
      }
  
      // Fetch photo column from farmerProblem table based on problem_id
      const combinedData = [];
      for (const item of responseData) {
        const { data: photoData, error: photoError } = await supabase
          .from('farmerProblem')
          .select('photo')
          .eq('problem_id', item.problem_id)
          .single();
  
        if (photoError) {
          console.error('Error fetching photo data from farmerProblem table:', photoError);
          return res.status(500).send({ error: 'Failed to fetch photo data from the database' });
        }
  
        combinedData.push({ ...item, photo: photoData.photo });
      }
  
      res.status(200).send(combinedData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error: 'An unexpected error occurred' });
    }
  });

  app.post('/changepassword', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword, phone_number } = req.body;
    try {
        // Fetch user from Supabase
        const { data, error } = await supabase.from('farmerProfile').select('password').eq('phone_number', phone_number).single();
        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password } = data;
        // Check if the current password matches
        if (currentPassword !== password) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        // Check if the new password matches the confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }
        // Update the user's password
        const { error: updateError } = await supabase.from('farmerProfile').update({ password: newPassword }).eq('phone_number', phone_number);
        if (updateError) {
            throw updateError;
        }
        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
