// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
  loadAllCases();
  initializeEventListeners();
});

function initializeEventListeners() {
  // Form submission for create/edit
  document.getElementById('case-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const editingId = document.getElementById('editing-id').value;

    if (editingId) {
      updateCase(editingId);
    } else {
      createCase();
    }
  });

  // Cancel button
  document.getElementById('cancel-btn').addEventListener('click', function (e) {
    e.preventDefault();
    resetForm();
  });

  // Search form submission
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchId = document.getElementById('search-id').value;
    if (searchId) {
      searchCaseById(searchId);
    }
  });

  // Clear search results
  document.getElementById('clear-search-btn').addEventListener('click', function (e) {
    e.preventDefault();
    clearSearchResults();
  });
}

function validateForm() {
  const caseNumber = document.getElementById('case-number').value.trim();
  const title = document.getElementById('title').value.trim();
  const status = document.getElementById('status').value;

  const errors = [];

  // Case number validation
  if (!caseNumber) {
    errors.push('Case number is required');
  } else if (caseNumber.length < 3 || caseNumber.length > 20) {
    errors.push('Case number must be between 3 and 20 characters');
  } else if (!/^[A-Z0-9]+$/.test(caseNumber)) {
    errors.push('Case number must contain only uppercase letters and numbers');
  }

  // Title validation
  if (!title) {
    errors.push('Title is required');
  } else if (title.length < 5 || title.length > 100) {
    errors.push('Title must be between 5 and 100 characters');
  }

  // Status validation
  if (!status) {
    errors.push('Status is required');
  }

  // Description validation
  const description = document.getElementById('description').value.trim();
  if (description && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  return errors;
}

function createCase() {
  console.log('createCase function called');

  const caseData = {
    caseNumber: document.getElementById('case-number').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    status: document.getElementById('status').value,
    dueDate: document.getElementById('due-date').value, // NEW: Include due date
  };

  console.log('Case data to be sent:', caseData);

  // Validate required fields
  if (!caseData.caseNumber || !caseData.title || !caseData.dueDate) {
    showMessage('Case Number, Title, and Due Date are required!', 'error');
    return;
  }

  // Validate due date is in the future
  const dueDateObj = new Date(caseData.dueDate);
  const now = new Date();
  if (dueDateObj <= now) {
    showMessage('Due date must be in the future!', 'error');
    return;
  }

  console.log('Making POST request to /api/cases');

  fetch('/api/cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(caseData),
  })
    .then(response => {
      console.log('Response status:', response.status);

      if (!response.ok) {
        return response.text().then(text => {
          console.error('Error response body:', text);
          throw new Error(`Failed to create case: ${response.status} - ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Case created successfully:', data);
      showMessage('Case created successfully!', 'success');
      resetForm();
      loadAllCases();
      // Switch back to all cases tab
      const allCasesTab = document.querySelector('[href="#all-cases"]');
      if (allCasesTab) {
        allCasesTab.click();
      }
    })
    .catch(error => {
      console.error('Error creating case:', error);
      showMessage('Error creating case: ' + error.message, 'error');
    });
}

function formatErrorMessage(errorData) {
  if (errorData.details && Array.isArray(errorData.details)) {
    return errorData.details.join(', ');
  }
  return errorData.message || 'Unknown error occurred';
}

function initializeValidation() {
  const caseNumberInput = document.getElementById('case-number');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');

  caseNumberInput.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
    validateField(this, validateCaseNumber);
  });

  titleInput.addEventListener('input', function () {
    validateField(this, validateTitle);
  });

  descriptionInput.addEventListener('input', function () {
    validateField(this, validateDescription);
  });
}

function validateField(input, validator) {
  const errors = validator(input.value);
  const errorElement = input.parentNode.querySelector('.govuk-error-message');

  if (errors.length > 0) {
    input.classList.add('govuk-input--error');
    if (!errorElement) {
      const error = document.createElement('p');
      error.className = 'govuk-error-message';
      error.innerHTML = '<span class="govuk-visually-hidden">Error:</span>' + errors[0];
      input.parentNode.insertBefore(error, input);
    } else {
      errorElement.innerHTML = '<span class="govuk-visually-hidden">Error:</span>' + errors[0];
    }
  } else {
    input.classList.remove('govuk-input--error');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

function validateCaseNumber(value) {
  const errors = [];
  if (!value.trim()) {
    errors.push('Case number is required');
  } else if (value.length < 3 || value.length > 20) {
    errors.push('Case number must be between 3 and 20 characters');
  } else if (!/^[A-Z0-9]+$/.test(value)) {
    errors.push('Case number must contain only uppercase letters and numbers');
  }
  return errors;
}

function validateTitle(value) {
  const errors = [];
  if (!value.trim()) {
    errors.push('Title is required');
  } else if (value.length < 5 || value.length > 100) {
    errors.push('Title must be between 5 and 100 characters');
  }
  return errors;
}

function validateDescription(value) {
  const errors = [];
  if (value && value.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }
  return errors;
}

function loadAllCases() {
  const container = document.getElementById('cases-container');
  container.innerHTML = '<div class="govuk-body">Loading cases...</div>';

  fetch('/api/cases')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load cases');
      return response.json();
    })
    .then(data => {
      displayCases(data.content || []);
    })
    .catch(error => {
      container.innerHTML = '<div class="govuk-error-message">Error loading cases: ' + error.message + '</div>';
    });
}

function searchCaseById(id) {
  const container = document.getElementById('search-results-container');
  container.innerHTML = '<div class="govuk-body">Searching for case...</div>';

  fetch(`/api/cases/${id}`)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Case not found');
        }
        throw new Error('Failed to load case');
      }
      return response.json();
    })
    .then(caseData => {
      displayCases([caseData], 'search-results-container');
      showMessage('Case found successfully!', 'success');
    })
    .catch(error => {
      container.innerHTML = `<div class="govuk-error-message">Error: ${error.message}</div>`;
      showMessage('Error searching for case: ' + error.message, 'error');
    });
}

function clearSearchResults() {
  document.getElementById('search-id').value = '';
  document.getElementById('search-results-container').innerHTML =
    '<div class="govuk-body">Enter a case ID above to search for a specific case.</div>';
}

function displayCases(cases, containerId = 'cases-container') {
  const container = document.getElementById(containerId);

  if (cases.length === 0) {
    container.innerHTML = '<p class="govuk-body">No cases found. Create one using the "Create Case" tab!</p>';
    return;
  }

  // Create table data
  const tableRows = cases.map(caseItem => [
    { text: caseItem.caseNumber },
    { text: caseItem.title },
    { text: caseItem.description || 'No description' },
    { html: getStatusTag(caseItem.status) },
    { text: new Date(caseItem.dueDate).toLocaleDateString() }, // NEW: Show due date
    { text: new Date(caseItem.createdDate).toLocaleDateString() },
    {
      html: `
        <button class="govuk-button govuk-button--secondary govuk-!-margin-right-2" onclick="editCase(${caseItem.id})">Edit</button>
        <button class="govuk-button govuk-button--warning" onclick="deleteCase(${caseItem.id})">Delete</button>
      `,
    },
  ]);

  const tableHtml = `
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Case Number</th>
          <th scope="col" class="govuk-table__header">Title</th>
          <th scope="col" class="govuk-table__header">Description</th>
          <th scope="col" class="govuk-table__header">Status</th>
          <th scope="col" class="govuk-table__header">Due Date</th>
          <th scope="col" class="govuk-table__header">Created Date</th>
          <th scope="col" class="govuk-table__header">Actions</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${tableRows
          .map(
            row => `
          <tr class="govuk-table__row">
            ${row.map(cell => `<td class="govuk-table__cell">${cell.html || cell.text}</td>`).join('')}
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHtml;
}

function getStatusTag(status) {
  const statusConfig = {
    OPEN: { text: 'Open', colour: 'blue' },
    IN_PROGRESS: { text: 'In Progress', colour: 'yellow' },
    CLOSED: { text: 'Closed', colour: 'green' },
    CANCELLED: { text: 'Cancelled', colour: 'red' },
  };

  const config = statusConfig[status] || { text: status, colour: 'grey' };
  return `<strong class="govuk-tag govuk-tag--${config.colour}">${config.text}</strong>`;
}

function editCase(id) {
  fetch(`/api/cases/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load case');
      return response.json();
    })
    .then(caseData => {
      document.getElementById('editing-id').value = caseData.id;
      document.getElementById('case-number').value = caseData.caseNumber;
      document.getElementById('title').value = caseData.title;
      document.getElementById('description').value = caseData.description || '';
      document.getElementById('status').value = caseData.status;

      // NEW: Handle due date - convert from ISO string to datetime-local format
      if (caseData.dueDate) {
        const dueDate = new Date(caseData.dueDate);
        const localISOTime = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        document.getElementById('due-date').value = localISOTime;
      }

      document.getElementById('form-heading').textContent = 'Edit Case';
      document.getElementById('submit-btn').textContent = 'Update Case';
      document.getElementById('cancel-btn').style.display = 'inline-block';

      // Switch to create case tab (which becomes edit mode)
      const createTab = document.querySelector('[href="#create-case"]');
      if (createTab) {
        createTab.click();
      }
    })
    .catch(error => {
      showMessage('Error loading case: ' + error.message, 'error');
    });
}

function updateCase(id) {
  const caseData = {
    caseNumber: document.getElementById('case-number').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    status: document.getElementById('status').value,
    dueDate: document.getElementById('due-date').value, // NEW: Include due date
  };

  // Validate due date is in the future
  const dueDateObj = new Date(caseData.dueDate);
  const now = new Date();
  if (dueDateObj <= now) {
    showMessage('Due date must be in the future!', 'error');
    return;
  }

  fetch(`/api/cases/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(caseData),
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to update case');
      return response.json();
    })
    .then(data => {
      showMessage('Case updated successfully!', 'success');
      resetForm();
      loadAllCases();
      // Switch back to all cases tab
      const allCasesTab = document.querySelector('[href="#all-cases"]');
      if (allCasesTab) {
        allCasesTab.click();
      }
    })
    .catch(error => {
      showMessage('Error updating case: ' + error.message, 'error');
    });
}

function deleteCase(id) {
  if (!confirm('Are you sure you want to delete this case?')) {
    return;
  }

  fetch(`/api/cases/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete case');
      showMessage('Case deleted successfully!', 'success');
      loadAllCases();
      // Also clear search results if we're on search tab
      const searchContainer = document.getElementById('search-results-container');
      if (searchContainer && searchContainer.innerHTML.includes('table')) {
        clearSearchResults();
      }
    })
    .catch(error => {
      showMessage('Error deleting case: ' + error.message, 'error');
    });
}

function resetForm() {
  document.getElementById('case-form').reset();
  document.getElementById('editing-id').value = '';
  document.getElementById('form-heading').textContent = 'Create New Case';
  document.getElementById('submit-btn').textContent = 'Create Case';
  document.getElementById('cancel-btn').style.display = 'none';
}

function showMessage(message, type) {
  const container = document.getElementById('message-container');

  const bannerClass = type === 'success' ? 'govuk-notification-banner--success' : '';
  const titleText = type === 'success' ? 'Success' : 'Error';

  container.innerHTML = `
        <div class="govuk-notification-banner ${bannerClass}" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
          <div class="govuk-notification-banner__header">
            <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">${titleText}</h2>
          </div>
          <div class="govuk-notification-banner__content">
            <p class="govuk-notification-banner__heading">${message}</p>
          </div>
        </div>
      `;

  // Auto-hide after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}
