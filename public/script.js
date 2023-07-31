// data-page: https://www.dofactory.com/html/body/data reduces the need for requests to the server.

// index.html
if (document.body.dataset.page === 'index') {
  // Navigation
  function generateNav() {
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.nav__list');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navigation.classList.toggle('active');
    });

    document.querySelectorAll('.nav__link').forEach((link) =>
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navigation.classList.remove('active');
      })
    );
  }

  // Contact form

  function sendMessage() {
    const form = document.querySelector('.contact__form');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Issue with network response.');
          }
        })
        .then((data) => {
          console.log(data);
          alert('Your message was submitted successfully!');
        })
        .catch((error) => {
          console.error(error);
          alert('Error while submitting message.');
        });
      form.reset();
    });
  }

  // Login

  function logIn() {
    const loginForm = document.querySelector('.login__form');

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const data = {
        username: formData.get('username'),
        password: formData.get('password'),
      };

      fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Issue with network response.');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.loggedIn) {
            alert('Welcome to the admin space!');
          }
          window.location.href = '/dashboard';
        })
        .catch((error) => {
          console.error(error);
          alert('Error validating credentials. Try again.');
        });
    });
  }

  generateNav();
  sendMessage();
  logIn();
}

// dashboard.html

if (document.body.dataset.page === 'dashboard') {
  // Admin details
  const detailsBox = document.getElementById('personal-container');

  fetch('http://localhost:3000/admin')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const username = document.createElement('li');
        username.innerHTML = `Username: ${item.username}`;
        detailsBox.appendChild(username);

        const fullName = document.createElement('li');
        fullName.innerHTML = `Full name: ${item.full_name}`;
        detailsBox.appendChild(fullName);

        const birthDate = document.createElement('li');
        const birthDateFormatted = new Date(
          item.birth_date
        ).toLocaleDateString();
        birthDate.innerHTML = `Birth date: ${birthDateFormatted}`;
        detailsBox.appendChild(birthDate);

        const location = document.createElement('li');
        location.innerHTML = `Location: ${item.city}`;
        detailsBox.appendChild(location);
      });
    });

  // Admin Inbox

  const inbox = document.getElementById('inbox-container');
  const inboxHeading = document.createElement('li');
  inboxHeading.className = 'inbox-heading';
  inboxHeading.innerHTML =
    '<span>Reference</span><span>Name</span><span>Email</span><span>Phone Number</span><span>Message</span><span>Date</span>';
  inbox.appendChild(inboxHeading);

  fetch('http://localhost:3000/inbox')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((item) => {
        const li = document.createElement('li');
        inbox.appendChild(li);

        const id = document.createElement('span');
        id.innerText = item.message_id;
        id.className = 'id';
        li.appendChild(id);

        const name = document.createElement('span');
        name.innerText = item.name;
        li.appendChild(name);

        const email = document.createElement('span');
        email.innerHTML = `<a href="mailto:${item.email}">${item.email}</a>`;
        li.appendChild(email);

        const number = document.createElement('span');
        number.innerText = item.number;
        li.appendChild(number);

        const content = document.createElement('span');
        content.innerText = item.content;
        li.appendChild(content);

        const date = document.createElement('span');
        const jsDate = new Date(item.date).toLocaleString();
        date.innerText = jsDate;
        li.appendChild(date);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
          handleDelete('/inbox', item.message_id, li);
        });
        li.appendChild(deleteButton);
      });
    })
    .catch((error) => {
      console.error(error);
    });

  // Admin Media Library

  const mediaUploadForm = document.getElementById('mediaUploadForm');

  mediaUploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(mediaUploadForm);
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Media uploaded successfully!');
      } else {
        alert('Failed to upload media.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload media.');
    }
  });

  // Admin Career

  function generateEditButton(id) {
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
      console.log('Editing item with ID:', id);
    });
    alert('Your edit has been submitted!');
    return editButton;
  }

  const career = document.getElementById('career-container');
  const careerHeading = document.createElement('li');
  careerHeading.className = 'career-heading';
  careerHeading.innerHTML =
    '<span>Position/Course</span><span>Company/School</span><span>Year</span>';
  career.appendChild(careerHeading);

  fetch('http://localhost:3000/career')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const li = document.createElement('li');
        career.appendChild(li);

        const position = document.createElement('span');
        position.innerText = item.position;
        li.appendChild(position);

        const company = document.createElement('span');
        company.innerText = item.company;
        li.appendChild(company);

        const year = document.createElement('span');
        year.innerText = item.year;
        li.appendChild(year);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
          handleDelete('/career', item.experience_id, li);
        });
        li.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', (event) => {
          event.preventDefault();

          const newPosition = prompt('Enter the new position:');
          const newCompany = prompt('Enter the new company:');
          const newYear = prompt('Enter the new year:');

          if (newPosition && newCompany && newYear) {
            const newData = {
              position: newPosition,
              company: newCompany,
              year: newYear,
            };

            handleEdit('/career', item.experience_id, newData);
          } else {
            alert('Please enter all three values for the item.');
          }
        });
        li.appendChild(editButton);
      });
    });

  const careerForm = document.getElementById('career-form');

  careerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(careerForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    fetch('http://localhost:3000/career', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Issue with network response.');
        }
      })
      .then((data) => {
        console.log(data);
        alert('Your message was submitted successfully!');
      })
      .catch((error) => {
        console.error(error);
        alert('Error while submitting message.');
      });
    careerForm.reset();
  });

  // Handle CRUD functions

  function handleDelete(path, id, removedItem) {
    fetch(`http://localhost:3000${path}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          alert('Item deleted successfully!');
          removedItem.remove();
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error');
      });
  }

  function handleEdit(path, id, updatedItem) {
    fetch(`http://localhost:3000${path}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => {
        if (response.ok) {
          alert('Item edited successfully!');
        }
        console.log(updatedItem, id);
      })
      .catch((error) => {
        console.error(error);
        alert('Error');
      });
  }
}
