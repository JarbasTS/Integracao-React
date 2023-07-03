import { useEffect, useState } from 'react';
import IRestaurante from '../../../interfaces/IRestaurante';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../../../http';

export default function AdministracaoRestaurantes() {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    http.get<IRestaurante[]>('restaurantes/').then(resposta => setRestaurantes(resposta.data));
  }, []);

  const excluir = (restauranteAhExcluir: IRestaurante) => {
    http.delete(`restaurantes/${restauranteAhExcluir.id}/`).then(() => {
      const listaRestaurantes = restaurantes.filter(
        restaurante => restaurante.id !== restauranteAhExcluir.id
      );
      setRestaurantes([...listaRestaurantes]);
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Editar</TableCell>
            <TableCell>Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes.map(restaurantes => (
            <TableRow key={restaurantes.id}>
              <TableCell>{restaurantes.nome}</TableCell>
              <TableCell>
                [ <Link to={`/admin/restaurantes/${restaurantes.id}`}>Editar</Link> ]
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="error" onClick={() => excluir(restaurantes)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
