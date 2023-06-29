document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_data);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function compose_email2(id) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = `${email.sender}`;
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    document.querySelector('#compose-body').value = `
    
    -------------------------------------------------------------------------------
    On ${email.timestamp} ${email.sender} wrote:
    ${email.body}`;
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(emails => {
        // Clear existing emails view
        document.querySelector('#emails-view').innerHTML = '';
        // Iterate over each sent email
        emails.forEach(email => {
          const {id,archived,read,subject,recipients,sender, body, timestamp} = email;
          // Create a box element for each email
          const emailBox = document.createElement('div');
          // Show the mailbox and hide other views
          emailBox.classList.add('email-box');
          emailBox.style.border = '0.5px solid black'; // Adding border
          emailBox.style.display = 'flex';
          emailBox.style.alignItems = 'center';
          emailBox.style.justifyContent = 'space-between';
          emailBox.style.padding = '10px';
          
          // Create and populate the content of the box
          const recipientsLabel = document.createElement('p');
          recipientsLabel.style.fontWeight = "bold"; // Making recipient email bold
          recipientsLabel.style.fontFamily = "Times New Roman";
          recipientsLabel.innerText = `${recipients}`;

          const senderLabel = document.createElement('p');
          senderLabel.style.fontWeight = "bold"; // Making recipient email bold
          senderLabel.style.fontFamily = "Times New Roman";
          senderLabel.innerText = `${sender}`;

          const subjectlabel = document.createElement('p');
         // Making recipient email bold
          subjectlabel.innerText = `${subject}`;
          
          
          const bodyContent = document.createElement('p');
          bodyContent.innerText = `${body}`;
          
          const timeLabel = document.createElement('p'); // Adding timestamp
          timeLabel.style.float = "right"; // Moving timestamp to right
          timeLabel.style.fontWeight = 'bold';
          timeLabel.style.fontFamily = 'italic';
          timeLabel.innerText = `${timestamp}`;

          const readlabel = document.createElement('p');
          readlabel.innerText = `${read}`;

          if (mailbox === 'sent') {
            // Code for 'sent' mailbox
            // Append the content to the email box
            emailBox.appendChild(recipientsLabel);
            emailBox.appendChild(subjectlabel);
            emailBox.appendChild(timeLabel);
          } else if ((mailbox === 'inbox') && (read==true) && (archived==false)){
            // Code for 'inbox' mailbox
            emailBox.appendChild(senderLabel);
            emailBox.appendChild(subjectlabel);
            emailBox.appendChild(timeLabel);
            emailBox.style.backgroundColor='grey';
          }
          else if ((mailbox === 'inbox') && (read==false) && (archived==false)){
            // Code for 'inbox' mailbox
            emailBox.appendChild(senderLabel);
            emailBox.appendChild(subjectlabel);
            emailBox.appendChild(timeLabel);
            emailBox.style.backgroundColor='white';
          }
          else if (mailbox === 'archive'){
            // Code for 'inbox' mailbox
            emailBox.appendChild(senderLabel);
            emailBox.appendChild(subjectlabel);
            emailBox.appendChild(timeLabel);
          }



          // Append the email box to the emails view
          document.querySelector('#emails-view').appendChild(emailBox);
          emailBox.addEventListener('click', () => email_data(id,mailbox));
          
        });
      });
    }

         


    function send_data(event) {
      
      const recipients = document.querySelector("#compose-recipients").value;
      const subject = document.querySelector("#compose-subject").value;
      const body = document.querySelector("#compose-body").value;
      const sender = document.querySelector("#compose-sender").value;
      const timestamp = new Date().toISOString();
    
      const emailData = {
        recipients: recipients,
        subject: subject,
        body: body,
        sender: sender,
        timestamp: timestamp,
      };
      fetch('/emails', {
        method: 'POST',
        body: JSON.stringify(emailData)
        })
      .then(response => response.json())
      .then(result => {
          
      });
      load_mailbox("sent");
    }

    function email_data(id,mailbox) {
      console.log(mailbox)
      console.log(id)
      mbox=mailbox
      if(mbox=='inbox'){
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })}
      
      fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(emails => {
        // Clear existing emails view
        document.querySelector('#emails-view').innerHTML = '';
        const emailBox = document.createElement('div');
        emailBox.classList.add('email-box');
        console.log(emails.read);
       
        // Create and populate the content of the box
        const senderLabel = document.createElement('p');
        senderLabel.style.font="Times New Roman";
        senderLabel.style.fontWeight = "bold"; // Making recipient email bold
        senderLabel.style.fontFamily = "Times New Roman";
        senderLabel.innerText = `From : ${emails.sender}`;
 
 
        const recipientsLabel = document.createElement('p');
        recipientsLabel.style.fontWeight = "bold"; // Making recipient email bold
        recipientsLabel.style.fontFamily = "Times New Roman";
        recipientsLabel.innerText = `To : ${emails.recipients}`;


        const subjectLabel = document.createElement('p');
        subjectLabel.style.fontWeight = "bold"; 
        subjectLabel.style.fontFamily = "Times New Roman";
        subjectLabel.innerText = `Subject : ${emails.subject}`;
       
        const bodyContent = document.createElement('p');
        bodyContent.style.fontFamily = "Times New Roman";
        bodyContent.innerText = `${emails.body}`;
        

        // Append the content to the email box
        emailBox.appendChild(senderLabel);
        emailBox.appendChild(recipientsLabel);
        emailBox.appendChild(subjectLabel);
        emailBox.appendChild(bodyContent);

        // Append the email box to the emails view
        document.querySelector('#emails-view').appendChild(emailBox);
        if(mbox=='inbox'){
        const button = document.createElement('button');
          // Set the button text
          button.textContent = 'Archive';

          // Set button attributes, if needed
          button.setAttribute('id', 'myButton');
          button.setAttribute('class', 'myButtonClass');
          document.querySelector('#emails-view').appendChild(button);

          const reply = document.createElement('button');
          // Set the button text
          reply.textContent = 'Reply';

          // Set button attributes, if needed
          reply.setAttribute('id', 'myButton');
          reply.setAttribute('class', 'myButtonClass');
          document.querySelector('#emails-view').appendChild(reply);
          reply.addEventListener('click', () => {
            compose_email2(id)})

        

          // Add event listener to the button
          button.addEventListener('click', () => {
            fetch(`/emails/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: true
              })
            })
            load_mailbox('archive')
          })
          
        };
          if(mbox=='archive'){
            const button = document.createElement('button');
              // Set the button text
              button.textContent = 'Unarchive';
    
              // Set button attributes, if needed
              button.setAttribute('id', 'myButton');
              button.setAttribute('class', 'myButtonClass');
              document.querySelector('#emails-view').appendChild(button);
            
    
              // Add event listener to the button
              button.addEventListener('click', () => {
                fetch(`/emails/${id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                      archived: false
                  })
                
                  
              })
              load_mailbox('inbox')
            })
            
                }
      }
       )}

 