import {Router} from 'express';
import diagnoseService from '../services/diagnoseService';
const router = Router();

router.get('/', (_req, res) => {
  console.log('Fetching all diagnoses!');
  res.send(diagnoseService.getDiagnoses());
});

export default router;