namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ajusteAttrProyecto : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.PersonalProyecto", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropIndex("GEN.PersonalProyecto", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            //AddColumn("GEN.Proyectos", "UnidadOrganizacionalId", c => c.String(maxLength: 10));
            AlterColumn("GEN.PersonalProyecto", "ClavePersona", c => c.String(nullable: false));
            DropColumn("GEN.PersonalProyecto", "RUPersona");
            DropColumn("GEN.PersonalProyecto", "FechaEfectiva");
            //DropColumn("GEN.Proyectos", "Gerencia");            
        }
        
        public override void Down()
        {
            //AddColumn("GEN.Proyectos", "Gerencia", c => c.String(maxLength: 10));
            AddColumn("GEN.PersonalProyecto", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.PersonalProyecto", "RUPersona", c => c.String(maxLength: 20));
            AlterColumn("GEN.PersonalProyecto", "ClavePersona", c => c.String(maxLength: 10));
            //DropColumn("GEN.Proyectos", "UnidadOrganizacionalId");
            CreateIndex("GEN.PersonalProyecto", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            AddForeignKey("GEN.PersonalProyecto", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
        }
    }
}
