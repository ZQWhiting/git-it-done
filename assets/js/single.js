const issueContainerEl = document.querySelector('#issues-container')

const getRepoIssues = function (repo) {
    const apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);
            });
        } else {
            alert(`There was a problem with your request!`)
        }
    })
    .catch(function (error) {
        alert(`Error`);
    });
};

const displayIssues = function(issues) {
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

getRepoIssues("ZQWhiting/run-buddy");