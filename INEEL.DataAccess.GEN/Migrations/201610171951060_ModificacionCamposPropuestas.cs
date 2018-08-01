namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificacionCamposPropuestas : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.Propuestas", "Titulo", c => c.String());
            AlterColumn("GEN.Propuestas", "Origen", c => c.String(maxLength: 40));
            AlterColumn("GEN.Propuestas", "Costos", c => c.Decimal(precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            AlterColumn("GEN.Propuestas", "Costos", c => c.Single());
            AlterColumn("GEN.Propuestas", "Origen", c => c.String(maxLength: 10));
            AlterColumn("GEN.Propuestas", "Titulo", c => c.String(maxLength: 200));
        }
    }
}
