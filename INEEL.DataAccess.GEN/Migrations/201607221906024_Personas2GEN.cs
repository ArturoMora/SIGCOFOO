namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Personas2GEN : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" }, "GEN.cat_Personas");
            DropForeignKey("GEN.PersonalProyecto", "ProyectoId", "GEN.Proyectos");
            /*DropIndex("GEN.PersonalProyecto", new[] { "ProyectoId" });
            DropIndex("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" });
            DropTable("GEN.PersonalProyecto");*/
        }
        
        public override void Down()
        {
            CreateTable(
                "GEN.PersonalProyecto",
                c => new
                    {
                        PersonalProyectoId = c.Long(nullable: false, identity: true),
                        ProyectoId = c.String(nullable: false, maxLength: 10),
                        RUPersonaId = c.String(maxLength: 20),
                        Personas_ClavePersona = c.String(maxLength: 10),
                        Personas_RUPersona = c.String(maxLength: 20),
                        Personas_FechaEfectiva = c.DateTime(),
                    })
                .PrimaryKey(t => t.PersonalProyectoId);
            
            CreateIndex("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" });
            CreateIndex("GEN.PersonalProyecto", "ProyectoId");
            AddForeignKey("GEN.PersonalProyecto", "ProyectoId", "GEN.Proyectos", "ProyectoId", cascadeDelete: true);
            AddForeignKey("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
        }
    }
}
