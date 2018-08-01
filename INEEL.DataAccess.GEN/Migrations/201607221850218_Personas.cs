namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Personas : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.PersonalProyecto", "RUPersonaId", c => c.String(maxLength: 20));
            AddColumn("GEN.PersonalProyecto", "Personas_ClavePersona", c => c.String(maxLength: 10));
            AddColumn("GEN.PersonalProyecto", "Personas_RUPersona", c => c.String(maxLength: 20));
            AddColumn("GEN.PersonalProyecto", "Personas_FechaEfectiva", c => c.DateTime());
            CreateIndex("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" });
            AddForeignKey("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" }, "GEN.cat_Personas");
            DropIndex("GEN.PersonalProyecto", new[] { "Personas_ClavePersona", "Personas_RUPersona", "Personas_FechaEfectiva" });
            DropColumn("GEN.PersonalProyecto", "Personas_FechaEfectiva");
            DropColumn("GEN.PersonalProyecto", "Personas_RUPersona");
            DropColumn("GEN.PersonalProyecto", "Personas_ClavePersona");
            DropColumn("GEN.PersonalProyecto", "RUPersonaId");
        }
    }
}
