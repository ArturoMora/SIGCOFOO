using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class UnidadOrganizacionalEmpresasRepository : IDisposable
    {

        private CR_Context _db;
        private GEN_Context _dbGen;

        public UnidadOrganizacionalEmpresasRepository()
        {
            _db = new CR_Context();
            _dbGen = new GEN_Context();
        }
        public UnidadOrganizacionalEmpresasRepository(CR_Context ctx)
        {
            _db = ctx;
        }

        public async Task<IEnumerable<UnidadOrganizacionalEmpresas>> GetAll()
        {
            try
            {
                var entities = await _db.UnidadOrganizacionalEmpresas.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetInformacionUnidadEmpresa(string unidad)
        {
            try
            {
                var entities = await _db.UnidadOrganizacionalEmpresas
                                .Include(e => e.Empresa)
                                .Include(e => e.Estados)
                                .Include(e => e.Municipios)
                                .Where(e => e.ClaveUnidad == unidad)
                                .AsNoTracking().FirstOrDefaultAsync();

                entities.contacto = await _db.Contacto.AsNoTracking().FirstOrDefaultAsync(e => e.ContactoId == entities.ContactoId);
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<UnidadOrganizacionalEmpresas>> GetAllnodes(UnidadOrganizacionalEmpresas uo)
        {
            try
            {

                List<UnidadOrganizacionalEmpresas> entities = null;


                if (String.IsNullOrEmpty(uo.ClaveUnidad))
                {

                    entities = await _db.UnidadOrganizacionalEmpresas
                    .Where(x => x.padre == null && x.EmpresaId == uo.EmpresaId)
                    .AsNoTracking().ToListAsync();
                    try
                    {


                        foreach (var item in entities)
                        {
                            if (item.ContactoId != null)
                            {
                                item.contacto = await _db.Contacto.AsNoTracking().Where(x => x.ContactoId == item.ContactoId).FirstOrDefaultAsync();
                            }

                            item.Children = await _db.UnidadOrganizacionalEmpresas
                                 .Where(x => x.padre == item.ClaveUnidad)
                                 .Where(x => x.Estado == 1)
                                 .OrderByDescending(e => e.FechaEfectiva)
                                 .AsNoTracking()
                                .ToListAsync();

                            if (item.Children.Count > 0)
                            {
                                foreach (var child in item.Children)
                                {
                                    if (child.ContactoId != null)
                                    {
                                        child.contacto = await _db.Contacto.AsNoTracking().Where(x => x.ContactoId == child.ContactoId).FirstOrDefaultAsync();
                                    }
                                }
                            }




                        }


                    }
                    catch (Exception e) { }
                }
                else

                {
                    var entities1 = await _db.UnidadOrganizacionalEmpresas
                       .Where(x => x.ClaveUnidad == uo.ClaveUnidad)
                       .Where(x => x.Estado == 1)
                        .OrderByDescending(e => e.FechaEfectiva)
                       .AsNoTracking().ToListAsync();
                    entities1 = entities1.Distinct(new ComparerIdOrClave()).ToList();
                    foreach (var item in entities1)
                    {
                        if (item.ContactoId != null)
                        {
                            item.contacto = await _db.Contacto.AsNoTracking().Where(x => x.ContactoId == item.ContactoId).FirstOrDefaultAsync();
                        }

                        entities = await _db.UnidadOrganizacionalEmpresas
                                        .Where(x => x.padre == item.ClaveUnidad && x.EmpresaId == item.EmpresaId && x.Estado == 1)
                                        .AsNoTracking().ToListAsync();
                        item.Children = entities;
                        if (item.Children.Count > 0)
                        {
                            foreach (var child in item.Children)
                            {
                                if (child.ContactoId != null)
                                {
                                    child.contacto = await _db.Contacto.AsNoTracking().Where(x => x.ContactoId == child.ContactoId).FirstOrDefaultAsync();
                                }
                            }
                        }


                        break;
                    }
                    return entities1.OrderBy(x => x.NombreUnidad);


                }
                return entities.OrderBy(x => x.NombreUnidad);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<UnidadOrganizacionalEmpresas> GetById(string id)
        {
            try
            {
                var entities = await _db.UnidadOrganizacionalEmpresas.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.ClaveUnidad == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<UnidadOrganizacionalEmpresas>> Validador(string Id)
        {
            try
            {
                var _result = await _db.UnidadOrganizacionalEmpresas
                    .AsNoTracking().Where(u => u.ClaveUnidad == Id).ToListAsync();

                return _result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> ValidadorClaves(UnidadOrganizacionalEmpresas model)
        {
            try
            {

                var existente = false;
                var datos = await _db.UnidadOrganizacionalEmpresas.AsNoTracking().Distinct().ToListAsync();
                datos.RemoveAll(x => x.PatronClave == "");  //Removemos las claves vacias (existen datos asi)
                var patrones = datos.Select(x => x.PatronClave).Distinct();  //Hacemos un distinct del patron de las claves (de PEMEX588 recuperamos PEMEX)
                var coincidencias = patrones.Where(x => x.Equals(model.ClaveUnidad)).Count();
                if (coincidencias > 0)
                {
                    existente = true;
                }

                return existente;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                _db.UnidadOrganizacionalEmpresas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Actualiza la unidad organizacional del contacto
        /// </summary>
        /// <param name="id">id del contacto</param>
        /// <param name="claveunidad">clave de la unidad organizacional de la empresa a la que pertenezca</param>
        /// <returns></returns>
        public async Task ActualizaUnidadContacto(int id, string claveunidad)
        {
            try
            {
                //Para desasociar el contacto anterior
                var contactos = await _db.Contacto.Where(x => x.ClaveUnidad == claveunidad).ToListAsync();  //Para futuros casos en donde se tenga multiples casos de contactos asociados a una unidad organizacional
                if (contactos.Count > 0)
                {
                    foreach (var c in contactos)
                    {
                        c.ClaveUnidad = null;
                        await _db.SaveChangesAsync();
                    }
                }
                //Ahora se agrega el nuevo contacto
                var contacto = await _db.Contacto.FirstOrDefaultAsync(x => x.ContactoId == id);
                if (contacto != null)
                {
                    contacto.ClaveUnidad = claveunidad;
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task ActualizaHistorialPuestosContacto(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                var contacto = await _db.Contacto.Where(x => x.ContactoId == model.ContactoId).AsNoTracking().FirstOrDefaultAsync();
                if (contacto != null)  //Cuando se agrega un contacto a una UO  (casos cuando se agrega un nuevo titular a la unidad)
                {
                    if (model.oldValueTitular != null)
                    {
                        //Actualizamos la informacion del ultimo puesto del contacto ACTUAL de la UO
                        await new ContactoPuestoHistoricoRepository().ModificaPuestoContacto(Convert.ToInt32(model.oldValueTitular), model.EmpresaId, null, null, "actualizar");
                    }
                    if (model.ContactoId != contacto.ContactoId)  //Con esto evitamos que con cada actualizacion de datos en una UO se agregue un puesto para el contacto
                    {
                        //Actualizamos la informacion del ultimo puesto del contacto NUEVO de la UO
                        await new ContactoPuestoHistoricoRepository().ModificaPuestoContacto(Convert.ToInt32(model.ContactoId), model.EmpresaId, model.ClaveUnidad, model.Puesto, "agregar");
                    }


                }
                else
                {
                    if (model.oldValueTitular != null)
                    {
                        //Actualizamos la informacion del ultimo puesto del contacto ACTUAL de la UO  (Casos en donde se quita a un titular de unidad)
                        await new ContactoPuestoHistoricoRepository().ModificaPuestoContacto(Convert.ToInt32(model.oldValueTitular), model.EmpresaId, null, null, "actualizar");
                    }

                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CrearArbolUnidadOrganizacional(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                //(1) Se crean los nodos de la unidad organizacional
                await CreaNodo(model);

                //(2) Se crea un registro en el historial de puestos del contacto
                await ActualizaHistorialPuestosContacto(model);

                //(3) Se crea un registro en el historial de unidades organizacionales de las empresas
                await new HistorialUnidadesOrganizacionalesEmpresasRepository().CrearHistorial(model, null);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public async Task CreaNodo(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                var ultimoNodo = "";
                int numero;

                var lista = await _db.UnidadOrganizacionalEmpresas.Where(x => x.EmpresaId == model.EmpresaId && x.padre == model.padre)
                                                                  .OrderBy(x => x.FechaEfectiva)
                                                                  .Select(x => x.ClaveUnidad)
                                                                  .AsNoTracking().ToListAsync();
                if (lista.Count > 0)
                {
                    ultimoNodo = lista.ElementAt(lista.Count - 1);  //De acuerdo a la lista elegimos el ultimo nodo
                    numero = RetornaDigitos(ultimoNodo, 3);  //Retornamos todos los numeros que contiene la cadena para posteriormente tomarlos en cuenta para el proximo id de la clave de la unidad
                }
                else
                {
                    numero = 0;  //En caso de que sea el primer nodo raiz u hoja
                }


                if (model.padre != null)  //Para el caso de los NODOS HOJAS(cualquiera que tenga una unidad como padre)
                {
                    if (!String.IsNullOrEmpty(ultimoNodo))
                    {
                        if (ultimoNodo.IndexOf('.') > 0) //Para los nuevos casos como CFE1.2
                        {
                            var array = ultimoNodo.Split('.');
                            var ultima = array[array.Length - 1];
                            numero = Convert.ToInt32(ultima);
                        }
                        else   //Para los casos migrados como CFE1285
                        {
                            numero = RetornaDigitos(ultimoNodo, 3);
                        }

                    }

                    var duplicidad = await Validador(model.padre.Trim() + "." + (++numero) + "");  //Verificamos si existe el registros
                    while (duplicidad.Count() > 0)  //Verifica las claves hasta que haya una clave disponible en la base de datos 
                    {
                        numero = numero * 2;
                        duplicidad = await Validador(model.padre.Trim() + "." + (numero) + "");
                    }

                    model.ClaveUnidad = model.padre.Trim() + "." + numero + "";  //Da como resultado algo parecido a: CFE1 + ".2"  ==> CFE1.2
                }
                else   //Para el caso de los NODOS RAMAS  (las que no tienen asociado ninguna unidad organizacional)
                {
                    var duplicidad = await Validador(model.ClaveUnidad + (++numero) + "");  //Verificamos si existe el registros
                    while (duplicidad.Count() > 0)  //Verifica las claves hasta que haya una clave disponible en la base de datos 
                    {
                        numero = numero * 2;
                        duplicidad = await Validador(model.ClaveUnidad + (numero) + "");
                    }

                    model.ClaveUnidad += numero;  //Da como resultado algo parecido a: CFE + "2"
                }

                _db.UnidadOrganizacionalEmpresas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private int RetornaDigitos(string ultimoNodo)
        {
            try
            {
                var terminacionNumerica = "";
                foreach (var caracter in ultimoNodo.ToCharArray())  //Con esto se evita que cuando se llegue al 10 se reinicie la numeracion
                {
                    if (!caracter.Equals('.') && !caracter.Equals('-') && !caracter.Equals('/'))
                    {
                        if (Char.IsDigit(caracter))
                        {
                            terminacionNumerica += caracter;
                        }
                    }
                }
                var numero = Convert.ToInt32(terminacionNumerica);
                return numero;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private int RetornaDigitos(string ultimoNodo, int cantidadDigitos)
        {
            try
            {
                var terminacionNumerica = "";
                var array = ultimoNodo.ToCharArray();
                for (var caracter = array.Length - 1; caracter != 0; caracter--)  //Con esto se evita que cuando se llegue al 10 se reinicie la numeracion
                {
                    if (!array[caracter].Equals('.') && !array[caracter].Equals('-') && !array[caracter].Equals('/'))
                    {
                        if (cantidadDigitos == terminacionNumerica.Length)
                        {
                            break;
                        }
                        if (Char.IsDigit(array[caracter]))
                        {
                            terminacionNumerica += array[caracter];
                        }
                    }
                }
                var listapreprocesada = terminacionNumerica.ToArray().Reverse();  //Revertimos la lista
                var cantidad = string.Join("", listapreprocesada); //La lista la convertimos a string
                var numero = Convert.ToInt32(cantidad); //se convierte a entero
                return numero;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task ActualizaArbol(UnidadOrganizacionalEmpresas param)
        {
            try
            {
                var nodo = await _db.UnidadOrganizacionalEmpresas.Where(x => x.ClaveUnidad == param.ClaveUnidad).FirstOrDefaultAsync();

                //El siguiente objeto se utiliza para realizar comparaciones de valores 
                UnidadOrganizacionalEmpresas nodoToCompare = new UnidadOrganizacionalEmpresas();
                nodoToCompare.NombreUnidad = nodo.NombreUnidad;
                nodoToCompare.ContactoId = nodo.ContactoId;
                nodoToCompare.padre = nodo.padre;

                //(1) Se crean los nodos de la unidad organizacional
                if (nodo != null)
                {
                    if ((param.CampoAgrupador != param.oldValueCampoAgrupador) || (nodo.padre != param.padre))  //Cuando se detecta un cambio de campo agrupador o de padre se deben de actualizar las migas de pan
                    {
                        if (param.padre != null) //Es una raiz (nodos que NO estan a nivel 0 en una unidad organizacional)
                        {
                            if (nodo.padre != param.padre)  //Cuando se hizo un cambio de padres entre los nodos
                            {
                                nodo.padre = param.padre;
                            }

                            var migaNodoPadre = await _db.UnidadOrganizacionalEmpresas.Where(x => x.ClaveUnidad.Equals(nodo.padre)).AsNoTracking().Select(x => x.Descripcion).FirstOrDefaultAsync();
                            await Update(nodo, param);  //actualizamos los demas parametros
                            ActualizaMigasDePanRamas(nodo.ClaveUnidad.Trim(), migaNodoPadre, param.CampoAgrupador);
                        }
                        else //Es una rama (nodos que ESTAN a nivel 0)
                        {
                            if (nodo.padre != param.padre)
                            {
                                nodo.padre = param.padre;
                            }
                            var migaNodoPadre = await _db.Empresa.Where(x => x.EmpresaId == param.EmpresaId).AsNoTracking().Select(x => x.NombreEmpresa).FirstOrDefaultAsync();

                            await Update(nodo, param); //actualizamos los demas parametros
                            ActualizaMigasDePanRamas(nodo.ClaveUnidad.Trim(), migaNodoPadre, param.CampoAgrupador);
                        }

                    }
                    else
                    {
                        await Update(nodo, param);
                        ActualizaMigasDePanRamas(param.ClaveUnidad.Trim(), param.newValueUnidad, param.CampoAgrupador);  //actualizamos la miga de pan (old value, new value)
                        //if (!param.CampoAgrupador)  //En caso de que sea un campo agrupador no se actualizaran las migas de pan
                        //{
                        //    ActualizaMigasDePanRamas(param.ClaveUnidad.Trim(), param.newValueUnidad, param.oldValueUnidad);  //actualizamos la miga de pan (old value, new value)
                        //}

                    }

                    //(2) Se crea un registro en el historial de puestos del contacto
                    await ActualizaHistorialPuestosContacto(param);

                    //(3) Se crea un registro en el historial de unidades organizacionales de las empresas
                    await new HistorialUnidadesOrganizacionalesEmpresasRepository().CrearHistorial(param, nodoToCompare);


                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Actualiza la descripcion(miga de pan) de todas los unidades a partir de una clave (haciendo uso de un replace del viejo valor con el nuevo)
        /// </summary>
        /// <param name="clave">Clave de la unidad(rama)</param>
        /// <param name="newValue">Nuevo valor a actualizar</param>
        /// <param name="oldValue">Valor a reemplazar</param>
        public void ActualizaMigasDePanRamas(string clave, string newValue, string oldValue)
        {
            try
            {
                var nodo = _db.UnidadOrganizacionalEmpresas.Where(x => x.ClaveUnidad == clave).FirstOrDefault();
                if (nodo.Descripcion != null)
                {
                    nodo.Descripcion = nodo.Descripcion.Replace(oldValue, newValue);
                    _db.SaveChanges();

                    var rama = _db.UnidadOrganizacionalEmpresas.Where(x => x.padre == clave).AsNoTracking().ToList();
                    if (rama.Count > 0) //Verificamos si el nodo tiene hijos
                    {
                        foreach (var hoja in rama)
                        {
                            ActualizaMigasDePanRamas(hoja.ClaveUnidad.Trim(), newValue, oldValue);
                        }
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Reconstruye las migas de pan asociadas a todos los nodos de una rama, tomando en cuenta que sean nodos agrupadores o no
        /// </summary>
        /// <param name="clave"></param>
        /// <param name="newValue"></param>
        /// <param name="nodoAgrupador"></param>
        public void ActualizaMigasDePanRamas(string clave, string newValue, Boolean nodoAgrupador)
        {
            try
            {
                var nodo = _db.UnidadOrganizacionalEmpresas.Where(x => x.ClaveUnidad == clave).FirstOrDefault();
                nodo.Descripcion = "";
                if (nodoAgrupador)
                {
                    nodo.Descripcion = newValue;
                }
                else
                {
                    nodo.Descripcion = newValue + '\\' + nodo.NombreUnidad;
                }
                nodo.CampoAgrupador = nodoAgrupador;
                _db.SaveChanges();
                var rama = _db.UnidadOrganizacionalEmpresas.Where(x => x.padre == nodo.ClaveUnidad).AsNoTracking().ToList();
                if (rama.Count > 0) //Verificamos si el nodo tiene hijos
                {
                    foreach (var hoja in rama)
                    {
                        ActualizaMigasDePanRamas(hoja.ClaveUnidad.Trim(), nodo.Descripcion, hoja.CampoAgrupador);
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> ContactosPorNodo(string clave)
        {
            try
            {
                var titular = await _db.UnidadOrganizacionalEmpresas.Where(x => x.ClaveUnidad == clave).AsNoTracking().Select(x => x.ContactoId).FirstOrDefaultAsync();
                var contactos = await _db.ContactoPuestoHistorico.Include(e => e.Contacto).AsNoTracking().Where(x => x.ClaveUnidad == clave)
                    .Select(x => new
                    {
                        x.ContactoId,
                        x.FechaInicio,
                        x.FechaFinal,
                        NombreCompleto = x.Contacto.NombreContacto + " " + x.Contacto.ApellidoPaterno + " " + x.Contacto.ApellidoMaterno,
                        x.Puesto
                    }).OrderByDescending(x => x.FechaInicio)
                    .ToListAsync();

                contactos.Remove(contactos.Where(x => x.ContactoId == titular).FirstOrDefault());
                return contactos;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza una entidad de tipo UnidadOrganizacionalEmpresas
        /// </summary>
        /// <param name="valOriginal">valor trackeado en entity framework</param>
        /// <param name="valNuevo">valor nuevo, normalmente el que se recibe desde web api</param>
        /// <returns></returns>
        public async Task Update(UnidadOrganizacionalEmpresas valOriginal, UnidadOrganizacionalEmpresas valNuevo)
        {
            try
            {
                _db.Entry(valOriginal).CurrentValues.SetValues(valNuevo);  //actualizamos los valores de la entidad
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                var _model = await _db.UnidadOrganizacionalEmpresas.FirstOrDefaultAsync(e => e.ClaveUnidad == model.ClaveUnidad);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.UnidadOrganizacionalEmpresas.FirstOrDefaultAsync(e => e.ClaveUnidad == id);
                if (_model != null)
                {
                    _db.UnidadOrganizacionalEmpresas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(UnidadOrganizacionalEmpresas obj)
        {
            try
            {
                var _obj = await _db.UnidadOrganizacionalEmpresas.FirstOrDefaultAsync(e => e.ClaveUnidad == obj.ClaveUnidad);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public int ValidaUnidad(string id)
        {
            try
            {
                int count = 0;

                var result = from contacto in _db.Contacto
                             join unidad in _db.UnidadOrganizacionalEmpresas
                             on contacto.ClaveUnidad equals unidad.ClaveUnidad
                             where (unidad.ClaveUnidad == id)
                             select contacto;

                count = result.ToList().Count();

                return count;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<string> VerificaAccionEliminarUnidad(string id)
        {
            try
            {
                var excepcionMessage = "";
                var contactos = await (from contacto in _db.Contacto
                                       join unidad in _db.UnidadOrganizacionalEmpresas
                                       on contacto.ClaveUnidad equals unidad.ClaveUnidad
                                       where (unidad.ClaveUnidad == id)
                                       select contacto).CountAsync();


                var propuestas = await (from propuesta in _dbGen.dbSetPropuesta
                                        where propuesta.ClaveUnidadEmpresa == id
                                        select propuesta
                                  ).CountAsync();

                var proyectos = await (from proyecto in _dbGen.dbSetProyectoGEN
                                       where proyecto.ClaveUnidadEmpresa == id
                                       select proyecto
                                 ).CountAsync();

                var iniciativas = await (from iniciativa in _dbGen.dbSetIniciativa
                                         where iniciativa.ClaveUnidadEmpresa == id
                                         select iniciativa).CountAsync();

                if (contactos > 0 || propuestas > 0 || proyectos > 0 || iniciativas > 0)
                {
                    excepcionMessage = "Se tienen asociados ";

                    if (contactos > 0)
                    {
                        excepcionMessage += "contactos, ";
                    }
                    if (propuestas > 0)
                    {
                        excepcionMessage += "propuestas, ";
                    }
                    if (proyectos > 0)
                    {
                        excepcionMessage += "proyectos, ";
                    }
                    if (iniciativas > 0)
                    {
                        excepcionMessage += "iniciativas, ";
                    }
                    if (excepcionMessage.Length > 1)
                    {
                        excepcionMessage = excepcionMessage.Substring(0, excepcionMessage.Length - 2);
                    }
                }

                return excepcionMessage;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}

