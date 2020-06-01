const issueContainerEl = document.querySelector('#issues-container')
const limitWarningEl = document.querySelector('#limit-warning');
const repoNameEl = document.querySelector('#repo-name')

const getRepoName = function () {
    // grab repo name from url query string
    const queryString = document.location.search;
    const repoName = queryString.split('=')[1];

    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // if no repo name was given, redirect to the homepage
        document.location.replace('./index.html');
    }
};

const getRepoIssues = function (repo) {
    const apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayIssues(data);

                    // check if api has paginated issues
                    if (response.headers.get('Link')) {
                        displayWarning(repo);
                    }
                });
            } else {
                // if not successful, redirect to homepage
                document.location.replace('./index.html');
            }
        })
        .catch(function (error) {
            alert(`Error`);
        });
};

const displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = `This repo has no open issues!`;
        return;
    }
    for (let i = 0; i < issues.length; i++) {
        const issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute('href', issues[i].html_url);
        issueEl.setAttribute('target', '_blank');

        const titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;
        issueEl.appendChild(titleEl);

        const typeEl = document.createElement('span')
        if (issues[i].pull_request) {
            typeEl.textContent = '(Pull request)';
        } else {
            typeEl.textContent = '(Issue)';
        }
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
}

const displayWarning = function (repo) {
    limitWarningEl.textContent = `To see more than 30 issues, visit `
    const linkEl = document.createElement('a');
    linkEl.textContent = `See More Issues on GitHub.com`;
    linkEl.setAttribute('href', `https://github.com/${repo}/issues`);
    linkEl.setAttribute('target', '_blank');
    limitWarningEl.appendChild(linkEl);
};

getRepoName();