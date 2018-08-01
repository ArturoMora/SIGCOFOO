namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cursoModificacion : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "MT.AdjuntoCursosPersonal",
            //    c => new
            //        {
            //            AdjuntoCursosPersonalId = c.Int(nullable: false, identity: true),
            //            AdjuntoId = c.Long(nullable: false),
            //            CursosPersonalId = c.Int(nullable: false),
            //            CursoInterno_CursoInternoId = c.Int(),
            //        })
            //    .PrimaryKey(t => t.AdjuntoCursosPersonalId)
            //    .ForeignKey("GEN.Adjunto", t => t.AdjuntoId, cascadeDelete: true)
            //    .ForeignKey("MT.CursosPersonal", t => t.CursosPersonalId, cascadeDelete: true)
            //    .ForeignKey("CH.tab_CursoInterno", t => t.CursoInterno_CursoInternoId)
            //    .Index(t => t.AdjuntoId)
            //    .Index(t => t.CursosPersonalId)
            //    .Index(t => t.CursoInterno_CursoInternoId);
            
            //CreateTable(
            //    "MT.CursosPersonal",
            //    c => new
            //        {
            //            CursosPersonalId = c.Int(nullable: false, identity: true),
            //            ProyectoId = c.String(nullable: false, maxLength: 10),
            //            Titulo = c.String(nullable: false, maxLength: 300),
            //            FechaCurso = c.DateTime(nullable: false),
            //            TipoCursoId = c.Int(nullable: false),
            //            Descripcion = c.String(nullable: false, maxLength: 500),
            //            EstadoActivoId = c.Int(nullable: false),
            //            FechaValidacion = c.DateTime(),
            //            EstadoFlujoId = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.CursosPersonalId)
            //    .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
            //    .ForeignKey("GEN.Proyectos", t => t.ProyectoId, cascadeDelete: true)
            //    .ForeignKey("MT.cat_TipoCurso", t => t.TipoCursoId, cascadeDelete: true)
            //    .Index(t => t.ProyectoId)
            //    .Index(t => t.TipoCursoId)
            //    .Index(t => t.EstadoFlujoId);
            
            //CreateTable(
            //    "MT.AutoresCursosPersonal",
            //    c => new
            //        {
            //            AutoresCursosPersonalId = c.Int(nullable: false, identity: true),
            //            Autor_ClavePersona = c.String(),
            //            Autor_Nombre = c.String(),
            //            CursosPersonalId = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.AutoresCursosPersonalId)
            //    .ForeignKey("MT.CursosPersonal", t => t.CursosPersonalId, cascadeDelete: true)
            //    .Index(t => t.CursosPersonalId);
            
        }
        
        public override void Down()
        {
            //DropForeignKey("MT.AdjuntoCursosPersonal", "CursoInterno_CursoInternoId", "CH.tab_CursoInterno");
            //DropForeignKey("MT.AdjuntoCursosPersonal", "CursosPersonalId", "MT.CursosPersonal");
            //DropForeignKey("MT.CursosPersonal", "TipoCursoId", "MT.cat_TipoCurso");
            //DropForeignKey("MT.CursosPersonal", "ProyectoId", "GEN.Proyectos");
            //DropForeignKey("MT.CursosPersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            //DropForeignKey("MT.AutoresCursosPersonal", "CursosPersonalId", "MT.CursosPersonal");
            //DropForeignKey("MT.AdjuntoCursosPersonal", "AdjuntoId", "GEN.Adjunto");
            //DropIndex("MT.AutoresCursosPersonal", new[] { "CursosPersonalId" });
            //DropIndex("MT.CursosPersonal", new[] { "EstadoFlujoId" });
            //DropIndex("MT.CursosPersonal", new[] { "TipoCursoId" });
            //DropIndex("MT.CursosPersonal", new[] { "ProyectoId" });
            //DropIndex("MT.AdjuntoCursosPersonal", new[] { "CursoInterno_CursoInternoId" });
            //DropIndex("MT.AdjuntoCursosPersonal", new[] { "CursosPersonalId" });
            //DropIndex("MT.AdjuntoCursosPersonal", new[] { "AdjuntoId" });
            //DropTable("MT.AutoresCursosPersonal");
            //DropTable("MT.CursosPersonal");
            //DropTable("MT.AdjuntoCursosPersonal");
        }
    }
}
