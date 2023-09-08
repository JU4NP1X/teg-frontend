# Frontend for Controlled Vocabulary Administration

This frontend project is a graduation project for the University of Carabobo, intended to be used by the virtual library of the university. It is designed to manage the controlled vocabulary of the library using self-trained neural networks. The system allows you to register authority lists, similar to thesauri used by organizations like UNESCO, which provide categories. These categories can be registered on the website and are used for document classification.

## Getting Started

To set up the frontend, follow these steps:

1. Clone the project repository from GitHub: `git clone https://github.com/JU4NP1X/teg-frontend`
2. Make sure you have Node.js and npm installed on your system.
3. Navigate to the project directory: `cd teg-frontend`
4. Install the project dependencies: `npm install`
5. Start the development server: `npm run dev`
6. Open your browser and go to `http://localhost:3000` to see the website in action.

## Functionality

Once the frontend is up and running, you can perform the following actions:

1. Register Authority Lists: You can add new authority lists, similar to UNESCO thesauri, which will provide categories for document classification.

2. Collect Datasets: Using automated scrapers, the system will collect datasets for the categories registered in the authority lists. These datasets will be used to train a new neural network.

3. Train a New Neural Network: Using the collected datasets, you can train a new neural network for the corresponding authority. This will improve the accuracy of document classification.

4. Classify Documents: The system allows you to classify documents entered by the user. The classifier will extract the text from the document and prompt for the authority to use in classification. It will then provide a list of category suggestions based on the document's content. Additionally, it will provide a search feature to add new categories if needed.

5. Manage Deprecated Categories: The document manager on the website will indicate if any document has a deprecated category. This will help identify and update categories that are no longer in use.

6. Documents Browser The document browser, allows that anyone can filter and access to any document register in the site. Include an pdf viewer (with fullscreen option) and downloader.

## Technologies Used

The frontend is developed using the following technologies:

- React: A JavaScript framework for building interactive user interfaces.
- Vite: A fast development environment for modern web applications.
- Other React and Vite dependencies, which can be found in the project's `package.json` file.

This project is specifically tailored for the virtual library of the University of Carabobo. Enjoy using the frontend for controlled vocabulary administration! If you have any questions or issues, feel free to contact the development team.
