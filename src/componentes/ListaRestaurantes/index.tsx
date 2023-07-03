import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      });
  };

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca
    };
    if (busca) {
      opcoes.params.search = busca;
    }
    if (ordenacao) {
      opcoes.params.ordering = ordenacao;
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  };

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  return (
    <section className={style.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas</em>!
      </h1>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%'
        }}
      >
        <Box component="form" onSubmit={buscar}>
          <TextField
            value={busca}
            onChange={evento => setBusca(evento.target.value)}
            label="Nome do Restaurante"
            variant="filled"
            fullWidth
            required
          />
          <Button sx={{ marginTop: 1 }} type="submit" variant="outlined" fullWidth>
            Buscar
          </Button>
        </Box>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-ordenacao">Ordenar</InputLabel>
          <Select
            name="select-ordenacao"
            id="select-ordenacao"
            value={ordenacao}
            onChange={evento => setOrdenacao(evento.target.value)}
            label="Ordenação"
          >
            <MenuItem value="">
              <em>Padrão</em>
            </MenuItem>
            <MenuItem value="id">Por ID</MenuItem>
            <MenuItem value="nome">Por Nome</MenuItem>
          </Select>

          <Button sx={{ marginTop: 1 }} type="submit" variant="outlined">
            Buscar
          </Button>
        </FormControl>
      </Box>
      {restaurantes?.map(item => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      {
        <button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
          Página Anterior
        </button>
      }
      {
        <button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
          Próxima página
        </button>
      }
    </section>
  );
};

export default ListaRestaurantes;
