const userFormEl = document.querySelector('#user-form');
const nameInputEl = document.querySelector('#username');
const repoContainerEl = document.querySelector('#repos-container');
const repoSearchTerm = document.querySelector('#repo-search-term');

const getUserRepos = function (user) {
    // format the github api url
    const apiUrl = `https://api.github.com/users/${user}/repos`;

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(function (error) {
            alert(`Unable to connect to GitHub`);
        });
};

// Form Handling
const formSubmitHandler = function (event) {
    event.preventDefault();

    // get value from input element
    const username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = '';
    } else {
        alert(`Please enter a GitHub username`)
    }
};

userFormEl.addEventListener('submit', formSubmitHandler);

// Display Repos
const displayRepos = function (repos, searchTerm) {
    // clear old content
    if (repos.length === 0) {
        repoContainerEl.textContent = `No repositories found.`;
        return;
    }

    repoContainerEl.textContent = ''
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (let i = 0; i < repos.length; i++) {
        // format repo name
        const repoName = `${repos[i].owner.login}/${repos[i].name}`;

        // create a container for each repo
        const repoEl = document.createElement('a');
        repoEl.classList = 'list-item flex-row justify-space-between align-center';
        repoEl.setAttribute('href', `./single-repo.html?repo=${repoName}`);

        // create a span element to hold repository name
        const titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        const statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        // check if curretn repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                `<i class='fas fa-times status-icon icon-danger'></i>${repos[i].open_issues_count} issue(s)`;
        } else {
            statusEl.innerHTML = `<i class='fas fa-check-square status-icon icon-success'></i>`;
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
}