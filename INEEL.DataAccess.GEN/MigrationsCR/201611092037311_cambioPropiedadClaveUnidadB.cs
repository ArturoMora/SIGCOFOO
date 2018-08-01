namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioPropiedadClaveUnidadB : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_BitacoraON", "ClaveUnidad", c => c.String(maxLength: 10));
            DropColumn("CR.tab_BitacoraON", "GerenciaId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_BitacoraON", "GerenciaId", c => c.Int(nullable: false));
            DropColumn("CR.tab_BitacoraON", "ClaveUnidad");
        }
    }
}
