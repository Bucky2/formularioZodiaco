var express = require('express');
var router = express.Router();
const Data = require('../models/Question_Model');
const Swal = require('sweetalert2');


// Ruta principal - Muestra el formulario de registro
router.get('/', async (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    // Manejar errores en caso de que ocurran durante la operación de carga
    console.log(error)
    res.status(500).send('Ocurrió un error durante la carga');
  }
});


router.post('/submit', async (req, res) => {
  try {
    const { name } = req.body;
    const answers = [];

    // Recorrer las respuestas del formulario y almacenarlas en el formato deseado
    for (let i = 1; i <= 10; i++) {
      const question = `Question ${i}`;
      const answer = parseInt(req.body[`answer${i}`]);
      answers.push({ question, answer });
    }

    // Crear un nuevo usuario con los datos recibidos
    const user = new Data({ name, answers });
  
    // Guardar el usuario en la base de datos
    await user.save();
    res.redirect('/')
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Server error');
  }
});


router.get('/success/ACB1220100646', async (req, res) => {
  try {
    const users = await Data.find();

    res.render('success', { users: users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});


const ExcelJS = require('exceljs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Ruta para descargar el archivo Excel
router.get('/download/excel', async (req, res) => {
  try {
    const users = await Data.find(); // Obtener todos los usuarios de la base de datos


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('resultados');

    // Escribir los encabezados en el archivo Excel
    worksheet.addRow(['Nombre','Libra', 'Escorpio']);

 
    users.forEach(user => {
      const userData = [user.namel];

      const groupedAnswers = {
        1: 0,
        2: 0,
        3: 0
      };

      user.answers.forEach(answer => {
        const answerValue = answer.answer;
        if (groupedAnswers.hasOwnProperty(answerValue)) {
          groupedAnswers[answerValue]++;
        }
      });

      // Agregar las respuestas agrupadas a los datos del usuario
      userData.push(groupedAnswers[1], groupedAnswers[2], groupedAnswers[3], groupedAnswers[4], groupedAnswers[5], groupedAnswers[6]);


      worksheet.addRow(userData);
    });

    // Configurar el encabezado de respuesta para descargar el archivo Excel
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="' + encodeURIComponent('resultados.xlsx') + '"'
    );

    // Guardar el archivo Excel en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Server error');
  }
});


// Ruta para descargar el archivo CSV
router.get('/download/csv', async (req, res) => {
  try {
    const users = await Data.find(); // Obtener todos los usuarios de la base de datos


    const csvData = [];

    csvData.push(['signo','Empatía', 'Creatividad:', 'Honestidad', 'Independencia']);

  
    users.forEach(user => {
      const userData = [user.name];      
              const groupedAnswers = {
                1: 0,
                2: 0,
              };      

      user.answers.forEach(answer => {
        const answerValue = answer.answer;
        if (groupedAnswers.hasOwnProperty(answerValue)) {
          groupedAnswers[answerValue]++;
        }
      });
      userData.push(groupedAnswers[1], groupedAnswers[2]);
      csvData.push(userData);
    });

    // Configurar el encabezado de respuesta para descargar el archivo CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="' + encodeURIComponent('resultados.csv') + '"'
    );

    // Convertir los datos del CSV a una cadena
    const csvString = csvData.map(row => row.join(',')).join('\n');

    // Enviar la cadena CSV al cliente
    res.send(csvString);
  } catch (error) {
    console.error('Error generating CSV file:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
