using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CurriculumVitaeRepository : IDisposable
    {
        SIGCOCHContext _ctx;

        //GEN_Context _gen;

        public CurriculumVitaeRepository()
        {
            _ctx = new SIGCOCHContext();
            //_gen = new GEN_Context();
        }

        public void Dispose()
        {
            _ctx.Dispose();
        }

        public async Task<Object> GetForCV(string id, IEnumerable<DerechosAutor> DA, IEnumerable<PropiedadIndustrial> PI, IEnumerable<PersonalProyecto> participacion) 
        {
            try
            {
                FormacionAcademicaRepository _formacionAcademica;
                IdiomasRepository _idiomas;
                AsociacionesRepository _asociacion;
                SNIRepository _sni;
                DistincionRepository _distincion;
                TesisDirigidaRepository _tesisdirigida;
                BecarioInternoRepository _becariointerno;
                BecarioExternoINEELRepository _becarioexterno;
                BecarioExternoINEELRepository _becariodirigido;
                ExperienciaDocenteRepository _experienciadocente;
                ExperienciaExternaRepository _experienciaexterna;
                PublicacionRepository _publicacion;
                PonenciaRepository _ponencia;
                //PersonalProyectoRepository _participacion;
                CursoInternoRepository _cursos;
                _formacionAcademica = new FormacionAcademicaRepository(_ctx);
                _idiomas = new IdiomasRepository(_ctx);
                _asociacion = new AsociacionesRepository(_ctx);
                _sni = new SNIRepository(_ctx);
                _distincion = new DistincionRepository(_ctx);
                _tesisdirigida = new TesisDirigidaRepository(_ctx);
                _becariointerno = new BecarioInternoRepository(_ctx);
                _becarioexterno = new BecarioExternoINEELRepository();
                _becariodirigido = new BecarioExternoINEELRepository();
                _experienciadocente = new ExperienciaDocenteRepository(_ctx);
                _experienciaexterna = new ExperienciaExternaRepository(_ctx);
                _publicacion = new PublicacionRepository(_ctx);
                _ponencia = new PonenciaRepository(_ctx);
                //_participacion = new PersonalProyectoRepository(_gen);
                _cursos = new CursoInternoRepository(_ctx);

                var formacionAcademicaResult = await _formacionAcademica.GetForCV(id);
                var idiomasResult = await _idiomas.GetForCV(id);
                var asociacionResult = await _asociacion.GetForCV(id);
                var SNIResult = await _sni.GetForCV(id);
                var distincionResult = await _distincion.GetForCV(id);
                var tesisDirigidaResult = await _tesisdirigida.GetForCV(id);
                var becarioInternoResult = await _becariointerno.GetForCV(id);
                var becarioExternoResult = await _becarioexterno.GetBecariosExternosForCurriculum(id);
                var becarioDirigidoResult = await _becariodirigido.GetBecariosDirigidosForCurriculum(id);
                var experienciaDocenteResult = await _experienciadocente.GetForCV(id);
                var experienciaExternaResult = await _experienciaexterna.GetForCV(id);
                var articuloResult = await _publicacion.GetForCV(id);
                var ponenciaResult = await _ponencia.GetForCV(id);
                //var participacionResult = await _participacion.GetForCV(id);
                var cursosResult = await _cursos.GetForCV(id);
                //var daResult = await _da.GetForCV(id);
                //var piResult = await _pi.GetForCV(id);
                var obj = new
                {

                    formacionAcademica = formacionAcademicaResult,
                    idiomas = idiomasResult,
                    asociacion = asociacionResult,
                    sni = SNIResult,
                    distincion = distincionResult,
                    tesisDirigida = tesisDirigidaResult,
                    becarioInterno = becarioInternoResult,
                    becarioExterno = becarioExternoResult,
                    becarioDirigido = becarioDirigidoResult,
                    experienciaDocente = experienciaDocenteResult,
                    experienciaExterna = experienciaExternaResult,
                    articulo = articuloResult,
                    ponencia = ponenciaResult,
                    participacion =participacion,
                    cursos = cursosResult,
                    da = DA,
                    pi = PI
                };

                return obj;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
