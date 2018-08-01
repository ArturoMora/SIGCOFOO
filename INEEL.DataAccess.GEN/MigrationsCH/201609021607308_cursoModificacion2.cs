namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cursoModificacion2 : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("MT.AdjuntoCursosPersonal", "AdjuntoId", "GEN.Adjunto");
            //DropForeignKey("MT.AutoresCursosPersonal", "CursosPersonalId", "MT.CursosPersonal");
            //DropForeignKey("MT.CursosPersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            //DropForeignKey("MT.CursosPersonal", "ProyectoId", "GEN.Proyectos");
            //DropForeignKey("MT.CursosPersonal", "TipoCursoId", "MT.cat_TipoCurso");
            //DropForeignKey("MT.AdjuntoCursosPersonal", "CursosPersonalId", "MT.CursosPersonal");
            //DropForeignKey("MT.AdjuntoCursosPersonal", "CursoInterno_CursoInternoId", "CH.tab_CursoInterno");
            //DropIndex("MT.AdjuntoCursosPersonal", new[] { "AdjuntoId" });
            //DropIndex("MT.AdjuntoCursosPersonal", new[] { "CursosPersonalId" });
            //DropIndex("MT.AdjuntoCursosPersonal", new[] { "CursoInterno_CursoInternoId" });
            //DropIndex("MT.CursosPersonal", new[] { "ProyectoId" });
            //DropIndex("MT.CursosPersonal", new[] { "TipoCursoId" });
            //DropIndex("MT.CursosPersonal", new[] { "EstadoFlujoId" });
            //DropIndex("MT.AutoresCursosPersonal", new[] { "CursosPersonalId" });
            //DropTable("MT.AdjuntoCursosPersonal");
            //DropTable("MT.CursosPersonal");
            //DropTable("MT.AutoresCursosPersonal");
        }
        
        public override void Down()
        {
            //CreateTable(
            //    "MT.AutoresCursosPersonal",
            //    c => new
            //        {
            //            AutoresCursosPersonalId = c.Int(nullable: false, identity: true),
            //            Autor_ClavePersona = c.String(),
            //            Autor_Nombre = c.String(),
            //            CursosPersonalId = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.AutoresCursosPersonalId);
            
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
            //    .PrimaryKey(t => t.CursosPersonalId);
            
            //CreateTable(
            //    "MT.AdjuntoCursosPersonal",
            //    c => new
            //        {
            //            AdjuntoCursosPersonalId = c.Int(nullable: false, identity: true),
            //            AdjuntoId = c.Long(nullable: false),
            //            CursosPersonalId = c.Int(nullable: false),
            //            CursoInterno_CursoInternoId = c.Int(),
            //        })
            //    .PrimaryKey(t => t.AdjuntoCursosPersonalId);
            
            //CreateIndex("MT.AutoresCursosPersonal", "CursosPersonalId");
            //CreateIndex("MT.CursosPersonal", "EstadoFlujoId");
            //CreateIndex("MT.CursosPersonal", "TipoCursoId");
            //CreateIndex("MT.CursosPersonal", "ProyectoId");
            //CreateIndex("MT.AdjuntoCursosPersonal", "CursoInterno_CursoInternoId");
            //CreateIndex("MT.AdjuntoCursosPersonal", "CursosPersonalId");
            //CreateIndex("MT.AdjuntoCursosPersonal", "AdjuntoId");
            //AddForeignKey("MT.AdjuntoCursosPersonal", "CursoInterno_CursoInternoId", "CH.tab_CursoInterno", "CursoInternoId");
            //AddForeignKey("MT.AdjuntoCursosPersonal", "CursosPersonalId", "MT.CursosPersonal", "CursosPersonalId", cascadeDelete: true);
            //AddForeignKey("MT.CursosPersonal", "TipoCursoId", "MT.cat_TipoCurso", "TipoCursoId", cascadeDelete: true);
            //AddForeignKey("MT.CursosPersonal", "ProyectoId", "GEN.Proyectos", "ProyectoId", cascadeDelete: true);
            //AddForeignKey("MT.CursosPersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
            //AddForeignKey("MT.AutoresCursosPersonal", "CursosPersonalId", "MT.CursosPersonal", "CursosPersonalId", cascadeDelete: true);
            //AddForeignKey("MT.AdjuntoCursosPersonal", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
        }
    }
}
