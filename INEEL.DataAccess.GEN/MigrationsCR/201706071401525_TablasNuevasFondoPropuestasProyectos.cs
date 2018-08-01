namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TablasNuevasFondoPropuestasProyectos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_PropuestaPorFondo",
                c => new
                    {
                        PropuestaPorFondoId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                        EdoProp = c.String(maxLength: 30),
                        FondoId = c.Int(nullable: false),
                        PropuestaId = c.String(maxLength: 25),
                    })
                .PrimaryKey(t => t.PropuestaPorFondoId)
                .ForeignKey("CR.tab_FondoPrograma", t => t.FondoId, cascadeDelete: false)
                .ForeignKey("GEN.Propuestas", t => t.PropuestaId)
                .Index(t => t.FondoId)
                .Index(t => t.PropuestaId);
            
            CreateTable(
                "CR.tab_ProyectoPorFondo",
                c => new
                    {
                        ProyectoPorFondoId = c.Int(nullable: false, identity: true),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                        EdoProyecto = c.String(maxLength: 30),
                        FondoId = c.Int(nullable: false),
                        ProyectoId = c.String(maxLength: 10),
                    })
                .PrimaryKey(t => t.ProyectoPorFondoId)
                .ForeignKey("CR.tab_FondoPrograma", t => t.FondoId, cascadeDelete: false)
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId)
                .Index(t => t.FondoId)
                .Index(t => t.ProyectoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_ProyectoPorFondo", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("CR.tab_ProyectoPorFondo", "FondoId", "CR.tab_FondoPrograma");
            DropForeignKey("CR.tab_PropuestaPorFondo", "PropuestaId", "GEN.Propuestas");
            DropForeignKey("CR.tab_PropuestaPorFondo", "FondoId", "CR.tab_FondoPrograma");
            DropIndex("CR.tab_ProyectoPorFondo", new[] { "ProyectoId" });
            DropIndex("CR.tab_ProyectoPorFondo", new[] { "FondoId" });
            DropIndex("CR.tab_PropuestaPorFondo", new[] { "PropuestaId" });
            DropIndex("CR.tab_PropuestaPorFondo", new[] { "FondoId" });
            DropTable("CR.tab_ProyectoPorFondo");
            DropTable("CR.tab_PropuestaPorFondo");
        }
    }
}
