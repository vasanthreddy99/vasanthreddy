document.addEventListener('DOMContentLoaded', () => {
  const yearSelect = document.getElementById('year');
  const semesterSelect = document.getElementById('semester');
  const subjectSelect = document.getElementById('subject');
  const notesContainer = document.getElementById('notes-container');
  const noteForm = document.getElementById('noteForm');

  // Function to fetch distinct years from the server and populate the year select dropdown
  const fetchYears = async () => {
      try {
          const response = await fetch('/api/years');
          const years = await response.json();
          yearSelect.innerHTML = ''; // Clear previous options
          years.forEach(year => {
              const option = document.createElement('option');
              option.value = year;
              option.textContent = year;
              yearSelect.appendChild(option);
          });
      } catch (error) {
          console.error('Error fetching years:', error);
      }
  };

  // Function to fetch semesters based on the selected year and populate the semester select dropdown
  const fetchSemesters = async () => {
      const selectedYear = yearSelect.value;
      try {
          const response = await fetch('/api/semesters', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ year: selectedYear })
          });
          const semesters = await response.json();
          semesterSelect.innerHTML = ''; // Clear previous options
          semesters.forEach(semester => {
              const option = document.createElement('option');
              option.value = semester;
              option.textContent = semester;
              semesterSelect.appendChild(option);
          });
      } catch (error) {
          console.error('Error fetching semesters:', error);
      }
  };

  // Function to fetch subjects based on the selected year and semester and populate the subject select dropdown
  const fetchSubjects = async () => {
      const selectedYear = yearSelect.value;
      const selectedSemester = semesterSelect.value;
      try {
          const response = await fetch('/api/subjects', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ year: selectedYear, semester: selectedSemester })
          });
          const subjects = await response.json();
          subjectSelect.innerHTML = ''; // Clear previous options
          subjects.forEach(subject => {
              const option = document.createElement('option');
              option.value = subject;
              option.textContent = subject;
              subjectSelect.appendChild(option);
          });
      } catch (error) {
          console.error('Error fetching subjects:', error);
      }
  };

  // Function to fetch and display notes based on the selected year, semester, and subject
  const fetchNotes = async () => {
      const selectedYear = yearSelect.value;
      const selectedSemester = semesterSelect.value;
      const selectedSubject = subjectSelect.value;
      try {
          const response = await fetch(`/api/notes`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ year: selectedYear, semester: selectedSemester, subject: selectedSubject })
          });
          const notes = await response.json();
          notesContainer.innerHTML = ''; // Clear previous notes
          notes.forEach(note => {
              const noteContainer = document.createElement('div');
  
              // Display subject name
              const subjectName = document.createElement('h2');
              subjectName.textContent = note.subject;
              noteContainer.appendChild(subjectName);
  
              // View button
              const viewButton = document.createElement('a');
              viewButton.href = `/api/pdf/${encodeURIComponent(note.subject)}`;
              viewButton.textContent = 'View';
              viewButton.target = '_blank'; // Open in a new tab
              noteContainer.appendChild(viewButton);
  
              // Download button
              const downloadButton = document.createElement('a');
              downloadButton.href = `/api/pdf/${encodeURIComponent(note.subject)}`;
              downloadButton.download = 'note.pdf';
              downloadButton.textContent = 'Download';
              noteContainer.appendChild(downloadButton);
  
              notesContainer.appendChild(noteContainer);
          });
      } catch (error) {
          console.error('Error fetching notes:', error);
      }
  };
  
  // Event listeners for select dropdowns
  yearSelect.addEventListener('change', fetchSemesters);
  semesterSelect.addEventListener('change', fetchSubjects);

  // Event listener for form submission
  noteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      fetchNotes();
  });

  // Fetch years when the page loads
  fetchYears();
});
