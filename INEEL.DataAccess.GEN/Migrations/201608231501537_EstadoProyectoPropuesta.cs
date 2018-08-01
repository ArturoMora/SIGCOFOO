namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EstadoProyectoPropuesta : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.Iniciativas", "EstadoIniciativa", c => c.String(maxLength: 20));
            AddColumn("GEN.Proyectos", "EstadoProyecto", c => c.String(maxLength: 20));
            AddColumn("GEN.Proyectos", "Costo", c => c.Single());
            AddColumn("GEN.Propuestas", "EstadoPropuesta", c => c.String(maxLength: 20));
        }
        
        public override void Down()
        {
            DropColumn("GEN.Propuestas", "EstadoPropuesta");
            DropColumn("GEN.Proyectos", "Costo");
            DropColumn("GEN.Proyectos", "EstadoProyecto");
            DropColumn("GEN.Iniciativas", "EstadoIniciativa");
        }
    }
}
