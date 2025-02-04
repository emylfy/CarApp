import express from 'express';
import cors from 'cors';

let app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

let cars = [
  { id: 1, mark: "Tomato", model: "Cover" },
  { id: 2, mark: "Huyndai", model: "Salami" },
  { id: 3, mark: "BMW", model: "WrumWrumich" }
];

app.get('/api/cars', (req, res) => {
  res.json(cars);
});

app.get('/api/cars/:id', (req, res) => {
  let car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).json({ error: 'Car not found' });
  res.json(car);
});

app.post('/api/cars', (req, res) => {
  let newCar = {
    id: cars.length + 1,
    mark: req.body.mark,
    model: req.body.model
  };
  cars.push(newCar);
  res.status(201).json(newCar);
});

app.put('/api/cars/:id', (req, res) => {
  let car = cars.find(c => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).json({ error: 'Car not found' });

  car.mark = req.body.mark;
  car.model = req.body.model;
  res.json(car);
});

app.delete('/api/cars/:id', (req, res) => {
  let carIndex = cars.findIndex(c => c.id === parseInt(req.params.id));
  if (carIndex === -1) return res.status(404).json({ error: 'Car not found' });

  cars = cars.filter(c => c.id !== parseInt(req.params.id));
  res.status(204).send();
});

let PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});