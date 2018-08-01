namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migPropuestaEnEstado : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_PropuestaEnEstado", "EstadoPropuestaId", "GI.cat_EstadoPropuesta");
            DropIndex("GI.tab_PropuestaEnEstado", new[] { "EstadoPropuestaId" });
            DropTable("GI.tab_PropuestaEnEstado");
        }
        
        public override void Down()
        {
            CreateTable(
                "GI.tab_PropuestaEnEstado",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PropuestaId = c.String(),
                        EstadoPropuestaId = c.Int(nullable: false),
                        Fecha = c.DateTime(nullable: false),
                        Justificacion = c.String(),
                        ClavePersona = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateIndex("GI.tab_PropuestaEnEstado", "EstadoPropuestaId");
            AddForeignKey("GI.tab_PropuestaEnEstado", "EstadoPropuestaId", "GI.cat_EstadoPropuesta", "Id", cascadeDelete: true);
        }
    }
}
