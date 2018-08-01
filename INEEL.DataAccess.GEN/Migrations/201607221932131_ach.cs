namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ach : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.PersonalProyecto",
                c => new
                    {
                        ClavePersona = c.String(maxLength: 10),
                        RUPersona = c.String(maxLength: 20),
                        FechaEfectiva = c.DateTime(nullable: false),
                        PersonalProyectoId = c.Long(nullable: false, identity: true),
                        ProyectoId = c.String(nullable: false, maxLength: 10),
                    })
                .PrimaryKey(t => t.PersonalProyectoId)
                .ForeignKey("GEN.cat_Personas", t => new { t.ClavePersona, t.RUPersona, t.FechaEfectiva })
                .ForeignKey("GEN.Proyectos", t => t.ProyectoId, cascadeDelete: true)
                .Index(t => new { t.ClavePersona, t.RUPersona, t.FechaEfectiva })
                .Index(t => t.ProyectoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.PersonalProyecto", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("GEN.PersonalProyecto", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropIndex("GEN.PersonalProyecto", new[] { "ProyectoId" });
            DropIndex("GEN.PersonalProyecto", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropTable("GEN.PersonalProyecto");
        }
    }
}
