namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estado1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_EstadoFlujo", "DescripcionCorta2", c => c.String(maxLength: 50));
            AlterColumn("GEN.PersonalProyecto", "DescripcionActividades", c => c.String(maxLength: 500));
            //DropColumn("GEN.Iniciativas", "EstadoIniciativa");
            DropColumn("GEN.cat_EstadoFlujo", "DescripcionCorta");
            //DropColumn("GEN.Proyectos", "EstadoProyecto");
            //DropColumn("GEN.Proyectos", "Costo");
            //DropColumn("GEN.Propuestas", "EstadoPropuesta");
        }
        
        public override void Down()
        {
            //AddColumn("GEN.Propuestas", "EstadoPropuesta", c => c.String(maxLength: 20));
            //AddColumn("GEN.Proyectos", "Costo", c => c.Single());
            //AddColumn("GEN.Proyectos", "EstadoProyecto", c => c.String(maxLength: 20));
            AddColumn("GEN.cat_EstadoFlujo", "DescripcionCorta", c => c.String(maxLength: 50));
            //AddColumn("GEN.Iniciativas", "EstadoIniciativa", c => c.String(maxLength: 20));
            AlterColumn("GEN.PersonalProyecto", "DescripcionActividades", c => c.String(maxLength: 300));
            DropColumn("GEN.cat_EstadoFlujo", "DescripcionCorta2");
        }
    }
}
