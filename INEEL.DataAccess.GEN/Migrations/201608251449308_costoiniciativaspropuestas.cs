namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class costoiniciativaspropuestas : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.Iniciativas", "Costos", c => c.Single());
            AddColumn("GEN.Propuestas", "Costos", c => c.Single());
            //DropColumn("GEN.Iniciativas", "Costo");
            //DropColumn("GEN.Propuestas", "Costo");
        }
        
        public override void Down()
        {
            AddColumn("GEN.Propuestas", "Costo", c => c.Single());
            AddColumn("GEN.Iniciativas", "Costo", c => c.Single());
            //DropColumn("GEN.Propuestas", "Costos");
            //DropColumn("GEN.Iniciativas", "Costos");
        }
    }
}
