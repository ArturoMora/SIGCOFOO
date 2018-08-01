using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Data.Entity;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class FuenteFinanciamientoRepository : IDisposable
    {
        private CR_Context _db;
        public FuenteFinanciamientoRepository()
        {
            _db = new CR_Context();
        }
        public async Task<int> countByStatus(Boolean status, List<String> origen)
        {
            try
            {
                return await (from t in _db.FuenteFinanciamiento
                               .Where(f => f.Estado == status && origen.Contains(f.OrigenDatos))
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FuenteFinanciamiento>> GetAll()
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento.AsNoTracking().ToListAsync();
                return entities.Where(x=> x.OrigenDatos.Equals("AMBOS") || x.OrigenDatos.Equals("SIGCO"));

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FuenteFinanciamiento>> GetAllActivas()
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento.AsNoTracking().ToListAsync();
                return entities.Where(x => x.OrigenDatos.Equals("AMBOS") || x.OrigenDatos.Equals("SIGCO") && x.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FuenteFinanciamiento> Get(int id)
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento.AsNoTracking().Include(e =>e.Contacto)
                    .FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FuenteFinanciamiento>> GetAllFKs()
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento
                    .AsNoTracking()
                    //.Include(e => e.TipoFuenteFinanciamiento)
                    //.Include(e => e.Pais)
                    .Include(e => e.FondoPrograma)
                    .OrderBy(e => e.NombreFF)
                    .ToListAsync(); //este no va para uno
                //para uno cambiar el tipo de task (en la definicion del metodo)
                return entities.Where(x => x.OrigenDatos.Equals("AMBOS") || x.OrigenDatos.Equals("SIGCO"));
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FuentesFinanciamientoSIGPROY>> GetAllFKSIGPROY()
        {
            try
            {
                List<FuentesFinanciamientoSIGPROY> fuentesS = new List<FuentesFinanciamientoSIGPROY>();
                FondosProgramaRepository fr = new FondosProgramaRepository();
                
                var entities = await _db.FuenteFinanciamiento
                    .AsNoTracking()
                    .Where(e=> e.Estado==true)
                    .OrderByDescending(x => x.NombreFF)
                    .Select(x => new FuentesFinanciamientoSIGPROY
                    {
                        FuenteFinanciamientoId = x.FuenteFinanciamientoId,
                        NombreFF = x.NombreFF,
                        FechaRegistroFF = x.FechaRegistro,
                        EstadoFF = x.Estado,
                        OrigenDatosFF = x.OrigenDatos
                    })
                    .ToListAsync();
                    fuentesS.AddRange(entities);
                
                foreach (FuentesFinanciamientoSIGPROY ffs in fuentesS)
                {
                    var fuenteId = ffs.FuenteFinanciamientoId;
                    ffs.FondosFinanciamientoSIGPROY = await fr.GetAllByFuenteSIGPROY(fuenteId);
                }

                return fuentesS;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetNombresFuentesFinanciamiento()
        {
            try
            {
                var fuentes = await (from ff in _db.FuenteFinanciamiento
                                     where ff.Estado == true && (ff.OrigenDatos.Equals("AMBOS") || ff.OrigenDatos.Equals("SIGCO"))
                                     select new
                                     {
                                         nombreFF = ff.NombreFF,
                                         idFuente = ff.FuenteFinanciamientoId
                                     }).AsNoTracking().ToListAsync();
                return fuentes;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Fuentes de financiamiento con estado en true
        public async Task<IEnumerable<FuenteFinanciamiento>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento.AsNoTracking().ToListAsync(); 
                return entities
                    .Where(e => e.Estado == true)
                    .Where(x => x.OrigenDatos.Equals("AMBOS") || x.OrigenDatos.Equals("SIGCO"));
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Fuentes de financiamiento con estado en true
        public async Task<IEnumerable<FuenteFinanciamiento>> GetAllByTipo(int id)
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento.AsNoTracking().ToListAsync();

                if (id!=0 ) {
                    return entities
                        //.Where(e => e.TipoFuenteFinanciamientoId == id)
                        .Where(x => x.OrigenDatos.Equals("AMBOS") || x.OrigenDatos.Equals("SIGCO")); 
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FuenteFinanciamiento> GetFKById(int id)
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento
                    .AsNoTracking()
                    //.Include(e => e.TipoFuenteFinanciamiento)
                    //.Include(e => e.Pais)
                     .Include(e => e.Contacto)
                    .Include("FondoPrograma.TematicaPorFondoPrograma.Tematica")
                    .Include("FondoPrograma.Empresa")
                    //.Include("FondoPrograma.Contacto")
                    .Include("FondoPrograma.Convocatoria")
                    .FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id );
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FuenteFinanciamiento> GetFKFPById(int id)
        {
            try
            {
                var entities = await _db.FuenteFinanciamiento
                    .AsNoTracking()
                    .Include("FondoPrograma.Convocatoria")
                    .FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(FuenteFinanciamiento model)
        {
            try
            {

                _db.FuenteFinanciamiento.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(FuenteFinanciamiento model)
        {
            try
            {
                var _model = await _db.FuenteFinanciamiento.FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == model.FuenteFinanciamientoId);
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

        public async Task UpdateEstado(FuenteFinanciamiento model)
        {
            try
            {
                var _model = await _db.FuenteFinanciamiento.FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == model.FuenteFinanciamientoId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteFuenteWithFKS(int id)
        {
            try
            {
                var _model = await _db.FuenteFinanciamiento.FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id);
                if (_model != null)
                {
                    //Se buscan dependencias y se eliminan 
                    var _fondos = await _db.FondoPrograma.Where(e=> e.FuenteFinanciamientoId==id).ToListAsync();
                    if( _fondos.Count>0){
                        _db.FondoPrograma.RemoveRange( _fondos );
                    }

                    //Se elimina la fuente asociada
                    _db.FuenteFinanciamiento.Remove(_model);
                    await _db.SaveChangesAsync(); // se guardan los cambios en la bd
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.FuenteFinanciamiento.FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id);
                if (_model != null)
                {
                    _db.FuenteFinanciamiento.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}

