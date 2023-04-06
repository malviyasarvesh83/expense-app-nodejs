// Form Validation

const validateForm = () => {
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("cat").value.toUpperCase();
  let description = document.getElementById("desc").value;

  if (amount == "") {
    alert("amount is required");
    return false;
  }
  if (category == "") {
    alert("category is required");
    return false;
  }
  if (description == "") {
    alert("description is required");
    return false;
  }
  return true;
};

// Function to Show Expense

const showExpense = async (response) => {
  document.getElementById('loginName').textContent = `Welcome ${response.data.name}`;
  try {
    let html = "";
    let totalAmount = 0;
    for (let i = 0; i < response.data.response.length; i++) {
      totalAmount += +response.data.response[i].amount;
      html += "<tr>";
      html += "<td>" + response.data.response[i].amount + "</td>";
      html += "<td>" + response.data.response[i].category + "</td>";
      html += "<td>" + response.data.response[i].description + "</td>";
      html +=
        '<td><button class="btn btn-warning" onclick="editExpense(' +
        response.data.response[i].id +
        ')">Edit</button><button class="btn btn-danger ml-3" onclick="deleteExpense(' +
        response.data.response[i].id +
        ')">Delete</button></td>';
      html += "</tr>";
    }
    const token = localStorage.getItem("token");
    let response1 = await axios.get('http://localhost:8000/user/totalexpenses', { headers: { 'Authorization': token } });
    console.log(response1);
    document.querySelector("#crudTable tbody").innerHTML = html;
    document.querySelector(".total-expense").innerHTML = `
            <h5 style="color: green;">Total Expense : ₹${response1.data.totalExpenses}</h5>
        `;
  } catch (error) {
    console.log(error);
  }
};

// Function to getExpense
const getExpense = async (page) => {
  try {
    const token = localStorage.getItem("token");
    const itemsPerPage = localStorage.getItem('rows');
    const page1 = page || 1;
    let response = await axios.get(
      `http://localhost:8000/expense/?page=${page1}&rows=${itemsPerPage}`,
      { headers: { 'Authorization': token } }
    );
    showExpense(response);
    document.getElementById("pagination").innerHTML += `
      <button class="btn btn-success prev" onclick="prev()">Prev</button>
    `;
    for (let i = 1; i <= response.data.lastPage; i++){
      document.getElementById("pagination").innerHTML += `
        <button class="btn pageNumber active">${i}</button>
      `;
    }
    document.getElementById("pagination").innerHTML += `
      <button class="btn btn-success next" onclick="next()">Next</button>
    `;
    if (response.data.hasPreviousPage==false) {
      document.querySelector('.prev').style.display = 'none';
    }
    if (response.data.hasNextPage==false) {
      document.querySelector('.next').style.display = 'none';
    }
    let response1 = await axios.get("http://localhost:8000/user/allusers", {
      headers: { Authorization: token },
    });

    if (response1.data.ispremiumuser == true) {
      document.getElementById("premium").style.display = "none";
      document.getElementById("pUser").textContent = "You are a Premium User";
      document.getElementById("leaderBoard").style.display = "inline-block";
      document.getElementById("downloadExpense").style.display = "inline-block";
      document.getElementById("leaderHeading").textContent = "Leader Board";
      document.getElementById("downloadFiles").textContent = "Downloaded Files";
      // showLeaderBoard();
      // downloadFiles();
    }
  } catch (error) {
    console.log(error);
  }
};

// onload get/show Expense
document.onload = getExpense();


// Function to addExpense

const addExpense = async () => {
  const token = localStorage.getItem('token');
  try {
    if (validateForm() == true) {
      let amount = document.getElementById("amount").value;
      let category = document.getElementById("cat").value.toUpperCase();
      let description = document.getElementById("desc").value;

      let response = await axios.post(
        "http://localhost:8000/expense",
        {
          amount: amount,
          category: category,
          description: description,
        },
        {
          headers: {
            "Authorization": token
          }
        }
      );
      document.getElementById("amount").value = "";
      document.getElementById("desc").value = "";
      getExpense();
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to edit/update Expense

const editExpense = async (id) => {
  const token = localStorage.getItem('token');
  try {
    document.getElementById('Submit').style.display = 'none';
    document.getElementById('Update').style.display = 'inline-block';

    let response = await axios.get(`http://localhost:8000/expense/${id}`, { headers: { 'Authorization': token } });
    document.getElementById('amount').value = response.data.amount;
    document.getElementById('cat').value = response.data.category.toLowerCase();
    document.getElementById('desc').value = response.data.description;

    document.getElementById('Update').onclick = async () => {
      if (validateForm() == true) {
        let category = document.getElementById("cat").value;
        let amount = document.getElementById("amount").value;
        let description = document.getElementById("desc").value;

        let response = await axios.put(`http://localhost:8000/expense/${id}`, {
          amount: amount,
          category: category,
          description: description,
        }, {
          headers: {
            'Authorization': token
          }
        });
        document.getElementById("Submit").style.display = "inline-block";
        document.getElementById("Update").style.display = "none";
        document.getElementById("amount").value = "";
        document.getElementById("desc").value = "";
        getExpense();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to deleteExpense

const deleteExpense = async (id) => {
  const token = localStorage.getItem('token');
  try {
    let response = await axios.delete(`http://localhost:8000/expense/${id}`, { headers: { "Authorization": token } });
    getExpense();
  } catch (error) {
    console.log(error);
  }
}

// Function to Buy Premium Feature Through RazorPay

const buyPremium = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:8000/purchase/premiummembership', { headers: { 'Authorization': token } });
  console.log(response);
  var options = {
    'key': response.data.key_id,
    'order_id': response.data.order.id,
    'handler': async (response) => {
      await axios.post('http://localhost:8000/purchase/updatetransactionstatus', {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      }, { headers: { 'Authorization': token } });
      alert('You are a Premium User Now');
      let response1 = await axios.get('http://localhost:8000/user/allusers', { headers: { 'Authorization': token } });
      if (response1.data.ispremiumuser==true) {
        document.getElementById("premium").style.display = 'none';
        document.getElementById("pUser").textContent = "You are a Premium User";
        document.getElementById("leaderBoard").style.display = "inline-block";
        document.getElementById("downloadExpense").style.display = 'inline-block';
        document.getElementById("leaderHeading").textContent = "Leader Board";
        document.getElementById("downloadFiles").textContent = 'Downloaded Files';
        downloadFiles();
      }
    }
  }
  const rzp = new Razorpay(options);
  rzp.open();

  rzp.on('payment.failed', async (response) => {
    console.log(response);
    let response1 = await axios.post(
      "http://localhost:8000/purchase/paymentfailed",
      {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      },
      { headers: { 'Authorization': token } }
    );
    console.log(response1);
    alert('Payment Failed');
  })
}

// Function to show leaderboard

const showLeaderBoard = async () => {
  try {
    const token = localStorage.getItem('token');
    let response = await axios.get('http://localhost:8000/premium/showleaderboard', { headers: { 'Authorization': token } });
    console.log(response);
    document.querySelector("#leaderBoardTable thead tr").innerHTML = `
      <th>Name</th>
      <th>Total Expense</th>
    `;
    for (let i = 0; i < response.data.length; i++) {
      document.querySelector("#leaderBoardTable tbody").innerHTML += `
      <tr>
        <td>${response.data[i].name}</td>
        <td>${response.data[i].totalExpenses}</td>
      </tr>
    `;
    }
    document.getElementById('leaderBoardTable').innerHTML;
  } catch (error) {
    console.log(error);
  }
}

// Function to Download Expense

const downloadExpense = async () => {
  try {
    const token = localStorage.getItem('token');
    let response = await axios.get('http://localhost:8000/download', { headers: { 'Authorization': token } });
    console.log(response.data);
    document.getElementById("downloadExpense").href = response.data.fileURL;
    document.getElementById("downloadExpense").download = 'myexpense.csv';
  } catch (error) {
    console.log(error);
  }
}

const downloadFiles = async () => {
  try {
    const token = localStorage.getItem('token');
    let response = await axios.get("http://localhost:8000/user/downloadfiles", {
      headers: { 'Authorization': token },
    });
    console.log(response);
    for (let i = 0; i < response.data.length; i++){
      document.getElementById("downloadfileslink").innerHTML += `
        <div>
          <a style="color:white;" href='${response.data[i].url}' download='${response.data[i].url}'>Expense${i+1}.txt</a>
        </div>
      `;
    }
  } catch (error) {
    console.log(error);
  }
}

const next = async () => {
  try {
    const page = 2;
    getExpense(page);
  } catch (error) {
    console.log(error);
  }

}

const prev = async () => {
  try {
    const page = 1;
    getExpense(page);
  } catch (error) {
    console.log(error);
  }
}

const changeRows = (selectValue) => {
  let x = selectValue.value;
  console.log("My Rows=", x);
  localStorage.setItem('rows', x);
}

document.onload = downloadFiles();