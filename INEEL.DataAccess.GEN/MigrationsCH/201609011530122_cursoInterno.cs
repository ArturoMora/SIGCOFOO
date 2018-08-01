namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cursoInterno : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_AutorInternoCursoInterno",
                c => new
                    {
                        AutorInternoCursoInternoId = c.Int(nullable: false, identity: true),
                        CursoInternoId = c.Int(nullable: false),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.AutorInternoCursoInternoId)
                .ForeignKey("CH.tab_CursoInterno", t => t.CursoInternoId, cascadeDelete: true)
                .Index(t => t.CursoInternoId);
            
            CreateTable(
                "CH.tab_CursoInterno",
                c => new
                    {
                        CursoInternoId = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                        Titulo = c.String(),
                        Descripcion = c.String(),
                        ProyectoId = c.String(maxLength: 10),
                        FechaCurso = c.DateTime(nullable: false),
                        TipoCursoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CursoInternoId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .ForeignKey("MT.cat_TipoCurso", t => t.TipoCursoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId)
                .Index(t => t.AdjuntoId)
                .Index(t => t.ProyectoId)
                .Index(t => t.TipoCursoId);
            
            //CreateTable(
            //    "MT.cat_TipoCurso",
            //    c => new
            //        {
            //            TipoCursoId = c.Int(nullable: false, identity: true),
            //            Nombre = c.String(nullable: false, maxLength: 250),
            //            Descripcion = c.String(nullable: false, maxLength: 300),
            //            FechaRegistro = c.DateTime(nullable: false),
            //            FechaEfectiva = c.DateTime(nullable: false),
            //            Estado = c.Boolean(nullable: false),
            //        })
            //    .PrimaryKey(t => t.TipoCursoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_AutorInternoCursoInterno", "CursoInternoId", "CH.tab_CursoInterno");
            DropForeignKey("CH.tab_CursoInterno", "TipoCursoId", "MT.cat_TipoCurso");
            DropForeignKey("CH.tab_CursoInterno", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("CH.tab_CursoInterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("CH.tab_CursoInterno", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CH.tab_CursoInterno", new[] { "TipoCursoId" });
            DropIndex("CH.tab_CursoInterno", new[] { "ProyectoId" });
            DropIndex("CH.tab_CursoInterno", new[] { "AdjuntoId" });
            DropIndex("CH.tab_CursoInterno", new[] { "EstadoFlujoId" });
            DropIndex("CH.tab_AutorInternoCursoInterno", new[] { "CursoInternoId" });
            //DropTable("MT.cat_TipoCurso");
            DropTable("CH.tab_CursoInterno");
            DropTable("CH.tab_AutorInternoCursoInterno");
        }
    }
}
