class Net {
  async login() {
    let req = await fetch("/addUser", {
      method: "POST",
      body: JSON.stringify({
        login: document.getElementById("login-data").value,
      }),
    });
    return req.json();
  }
  updateTab(tab) {
    let response = fetch("/updateTab", {
      method: "POST",
      body: JSON.stringify({ newTab: tab })
    }).then(res => res.json())
    return response
  }
  checkTab() {
    let response = fetch("/getTab", {
      method: "POST",
    })
      .then(res => res.json())
    return response
  }


  reset() {
    fetch("/reset", {
      method: "POST",
    });
  }
}
