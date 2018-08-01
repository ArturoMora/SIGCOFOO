namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioCRTabla : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_PropuestaPorFondo", "FondoId", "CR.tab_FondoPrograma");
            DropForeignKey("CR.tab_PropuestaPorFondo", "PropuestaId", "GEN.Propuestas");
            DropForeignKey("CR.tab_ProyectoPorFondo", "FondoId", "CR.tab_FondoPrograma");
            DropForeignKey("CR.tab_ProyectoPorFondo", "ProyectoId", "GEN.Proyectos");
            DropIndex("CR.tab_PropuestaPorFondo", new[] { "FondoId" });
            DropIndex("CR.tab_PropuestaPorFondo", new[] { "PropuestaId" });
            DropIndex("CR.tab_ProyectoPorFondo", new[] { "FondoId" });
            DropIndex("CR.tab_ProyectoPorFondo", new[] { "ProyectoId" });
            DropTable("CR.tab_PropuestaPorFondo");
            DropTable("CR.tab_ProyectoPorFondo");
        }
        
        public override void Down()
        {
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
                .PrimaryKey(t => t.ProyectoPorFondoId);
            
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
                .PrimaryKey(t => t.PropuestaPorFondoId);
            
            CreateIndex("CR.tab_ProyectoPorFondo", "ProyectoId");
            CreateIndex("CR.tab_ProyectoPorFondo", "FondoId");
            CreateIndex("CR.tab_PropuestaPorFondo", "PropuestaId");
            CreateIndex("CR.tab_PropuestaPorFondo", "FondoId");
            AddForeignKey("CR.tab_ProyectoPorFondo", "ProyectoId", "GEN.Proyectos", "ProyectoId");
            AddForeignKey("CR.tab_ProyectoPorFondo", "FondoId", "CR.tab_FondoPrograma", "FondoProgramaId", cascadeDelete: true);
            AddForeignKey("CR.tab_PropuestaPorFondo", "PropuestaId", "GEN.Propuestas", "PropuestaId");
            AddForeignKey("CR.tab_PropuestaPorFondo", "FondoId", "CR.tab_FondoPrograma", "FondoProgramaId", cascadeDelete: true);
        }
    }
}
