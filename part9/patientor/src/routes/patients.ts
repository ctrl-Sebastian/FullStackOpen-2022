import {Router} from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
const router = Router();

router.get('/', (_req, res) => {
  console.log('Fetching all patients!');
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (_req, res) =>{
  const patient = patientService.findById(String(_req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (_req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(_req.body);

    const addedPatient = patientService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;