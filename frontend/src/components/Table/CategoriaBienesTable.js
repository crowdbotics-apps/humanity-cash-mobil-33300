import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import MDButton from "../MDButton";
import Icon from "@mui/material/Icon";
import {useStores} from "../../models";

const CategoriaBienesTable = ({
                                categoriasList,
                                categoriasCount,
                                controller,
                                setController,
                                handleEdit,
                                handleDelete
                              }) => {

  const rootStore = useStores()
  const {loginStore} = rootStore

  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  const encabezado = [
    'Descripción',
    'Cuenta',
    'Cuenta Activo',
    'Cuenta Depreciacion',
    'Cuenta Depreciacion Acumulada',
    'Tasa (%)',
    'Vida útil (Años)',
    'Deprecia',
    'Deprecia el mes siguiente',
    'Acciones'
  ]

  return (
    <TableContainer>
      <Table>
        <TableHead sx={{display: "table-header-group"}}>
          <TableRow>
            {encabezado.map((e, i) => (<TableCell key={i}>{e}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {categoriasList.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.descripcion}
              </TableCell>
              <TableCell>
                {category.cuenta}
              </TableCell>
              <TableCell>
                {category.cuenta_activo}
              </TableCell>
              <TableCell>
                {category.cuenta_depreciacion}
              </TableCell>
              <TableCell>
                {category.cuenta_depreciacion_acumulada}
              </TableCell>
              <TableCell>
                {category.tasa}
              </TableCell>
              <TableCell>
                {category.vida_util}
              </TableCell>
              <TableCell>
                {category.deprecia ? "Sí" : "No"}
              </TableCell>
              <TableCell>
                {category.deprecia_mes_siguiente ? "Sí" : "No"}
              </TableCell>
              <TableCell>
                <MDButton variant="gradient" color="info" onClick={() => handleEdit(category)}>
                  <Icon>auto_fix_high</Icon>
                </MDButton>
                <MDButton variant="gradient" color="error" onClick={() => handleDelete(category.id)}>
                  <Icon>delete</Icon>
                </MDButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        onPageChange={handlePageChange}
        page={controller.page}
        count={categoriasCount}
        rowsPerPage={controller.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}

export default CategoriaBienesTable;
